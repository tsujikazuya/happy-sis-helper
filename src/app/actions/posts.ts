"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { GoogleGenAI } from "@google/genai";

// 投稿生成パラメータの型定義
export interface GenerateParams {
  direction: string;
  theme: string;
  snsType: string;
  tone: string;
  targetAudience?: string;
  ctaType?: string;
  additionalInfo?: string;
}

// AI生成結果の型定義
export interface GeneratedContent {
  title: string;
  hook: string;
  body: string;
  short: string;
  cta: string;
  tags: string[];
  imageConcept: string;
}

// AI生成アクション
export async function generatePostAction(params: GenerateParams): Promise<{ success: boolean; data?: GeneratedContent; error?: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      error: "Gemini APIキーが設定されていません。環境変数 GEMINI_API_KEY を設定してください。",
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // SNSごとの最大文字数や書き方の特徴を設定
    let snsGuideline = "";
    if (params.snsType === "Note") {
      snsGuideline = "Note向け：長文で読ませるエッセイ・コラム風。見出しや段落を意識し、丁寧な解説を加える。";
    } else if (params.snsType === "Instagram") {
      snsGuideline = "Instagram向け：ビジュアルと連動する構成。本文はスクロールしやすいように適宜絵文字や改行を挟み、要点を箇条書きにするなどして読みやすさを高める。";
    } else if (params.snsType === "Facebook") {
      snsGuideline = "Facebook向け：信頼感のある文体。共感と実用的な知恵をバランスよく配合し、大人の読者層に向けて落ち着いたトーンで書く。";
    }

    const systemInstruction = `
あなたは「はっぴぃandプロジェクト」のSNS担当サポートAIです。
「はっぴぃandプロジェクト」は、高齢者やその家族に対して、終活、身元保証、老後の生活不安に関する相談・支援サービスを提供しています。

【超重要ルール：安全性の確保】
生成される投稿文は、最終的に人間（担当者）が目視で確認し修正・公開する前提です。
そのため、医療・法律・税務等の専門的な判断や事実関係について「絶対に大丈夫」「〜になります」といった極端な断定を避けてください。
「〜と言われています」「〜を検討してみてはいかがでしょうか」「一緒に考えてみませんか」といった、一般的な注意喚起や共感、アドバイスの範囲に留める文章にしてください。信頼感と優しさ、寄り添う姿勢を最優先します。

【出力要件】
指定されたフォーマット（JSON）で出力してください。以下の項目を含めてください。
1. title: 投稿のタイトル案
2. hook: 冒頭の惹きつけの一文（1行目）
3. body: 本文（SNSに応じた適切な改行・段落）
4. short: 本文の要約、またはInstagramの画像スライド用の短いキャプション
5. cta: 行動を促すテキスト
6. tags: ハッシュタグ（5〜8個、#付きの文字列配列）
7. imageConcept: 投稿に添える画像や動画のビジュアル構成案、または撮影・素材探しのための指示
`;

    const userPrompt = `
以下の指示に従って、SNS投稿案を1件作成してください。

■ 条件：
- 投稿の方向性: ${params.direction}
- 投稿テーマ: ${params.theme}
- 投稿先SNS: ${params.snsType} (${snsGuideline})
- 文体・トーン: ${params.tone}
${params.targetAudience ? `- 対象読者: ${params.targetAudience}` : ""}
${params.ctaType ? `- CTA（行動喚起）の種類: ${params.ctaType}` : ""}
${params.additionalInfo ? `- 追加指示・メモ: ${params.additionalInfo}` : ""}

■ 出力形式：
JSON形式で、以下のスキーマに従って出力してください。
`;

    const schema = {
      type: "object",
      properties: {
        title: { type: "string" },
        hook: { type: "string" },
        body: { type: "string" },
        short: { type: "string" },
        cta: { type: "string" },
        tags: {
          type: "array",
          items: { type: "string" },
        },
        imageConcept: { type: "string" },
      },
      required: ["title", "hook", "body", "short", "cta", "tags", "imageConcept"],
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      },
    });

    if (!response.text) {
      return { success: false, error: "AIからの応答が空でした。もう一度お試しください。" };
    }

    const data = JSON.parse(response.text) as GeneratedContent;
    return { success: true, data };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      error: `AI生成中にエラーが発生しました: ${error.message || "不明なエラー"}`,
    };
  }
}

// データベース保存アクション
export async function savePostAction(
  params: GenerateParams,
  content: GeneratedContent
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const post = await prisma.postDraft.create({
      data: {
        direction: params.direction,
        theme: params.theme,
        snsType: params.snsType,
        tone: params.tone,
        targetAudience: params.targetAudience || null,
        ctaType: params.ctaType || null,
        additionalInfo: params.additionalInfo || null,
        
        generatedTitle: content.title,
        generatedHook: content.hook,
        generatedBody: content.body,
        generatedShort: content.short,
        generatedCta: content.cta,
        generatedTags: JSON.stringify(content.tags),
        imageConcept: content.imageConcept,
      },
    });

    revalidatePath("/");
    revalidatePath("/posts");
    return { success: true, id: post.id };
  } catch (error: any) {
    console.error("DB Save Error:", error);
    return { success: false, error: `保存中にエラーが発生しました: ${error.message}` };
  }
}

// データベース更新アクション
export async function updatePostAction(
  id: string,
  data: Partial<GenerateParams> & {
    generatedTitle?: string;
    generatedHook?: string;
    generatedBody?: string;
    generatedShort?: string;
    generatedCta?: string;
    generatedTags?: string[];
    imageConcept?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = {};
    
    if (data.direction !== undefined) updateData.direction = data.direction;
    if (data.theme !== undefined) updateData.theme = data.theme;
    if (data.snsType !== undefined) updateData.snsType = data.snsType;
    if (data.tone !== undefined) updateData.tone = data.tone;
    if (data.targetAudience !== undefined) updateData.targetAudience = data.targetAudience;
    if (data.ctaType !== undefined) updateData.ctaType = data.ctaType;
    if (data.additionalInfo !== undefined) updateData.additionalInfo = data.additionalInfo;

    if (data.generatedTitle !== undefined) updateData.generatedTitle = data.generatedTitle;
    if (data.generatedHook !== undefined) updateData.generatedHook = data.generatedHook;
    if (data.generatedBody !== undefined) updateData.generatedBody = data.generatedBody;
    if (data.generatedShort !== undefined) updateData.generatedShort = data.generatedShort;
    if (data.generatedCta !== undefined) updateData.generatedCta = data.generatedCta;
    if (data.generatedTags !== undefined) updateData.generatedTags = JSON.stringify(data.generatedTags);
    if (data.imageConcept !== undefined) updateData.imageConcept = data.imageConcept;

    await prisma.postDraft.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");
    revalidatePath("/posts");
    revalidatePath(`/posts/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("DB Update Error:", error);
    return { success: false, error: `更新中にエラーが発生しました: ${error.message}` };
  }
}

// データベース削除アクション
export async function deletePostAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.postDraft.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/posts");
    return { success: true };
  } catch (error: any) {
    console.error("DB Delete Error:", error);
    return { success: false, error: `削除中にエラーが発生しました: ${error.message}` };
  }
}

// 全投稿取得アクション
export async function getPostsAction() {
  try {
    const posts = await prisma.postDraft.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return posts.map(post => ({
      ...post,
      tags: JSON.parse(post.generatedTags) as string[],
    }));
  } catch (error) {
    console.error("DB Fetch Error:", error);
    return [];
  }
}

// 個別投稿取得アクション
export async function getPostByIdAction(id: string) {
  try {
    const post = await prisma.postDraft.findUnique({
      where: { id },
    });
    if (!post) return null;
    return {
      ...post,
      tags: JSON.parse(post.generatedTags) as string[],
    };
  } catch (error) {
    console.error("DB Fetch Single Error:", error);
    return null;
  }
}
