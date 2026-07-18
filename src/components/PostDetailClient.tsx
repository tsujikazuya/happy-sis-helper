"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePostAction, deletePostAction, savePostAction } from "@/app/actions/posts";
import { CopyButton } from "@/components/CopyButton";
import { 
  ArrowLeft, Save, Copy, Trash2, CheckCircle, 
  AlertCircle, RefreshCw, Calendar 
} from "lucide-react";
import Link from "next/link";

interface Post {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  direction: string;
  theme: string;
  snsType: string;
  tone: string;
  targetAudience: string | null;
  ctaType: string | null;
  additionalInfo: string | null;
  generatedTitle: string;
  generatedHook: string;
  generatedBody: string;
  generatedShort: string;
  generatedCta: string;
  tags: string[];
  imageConcept: string;
}

interface PostDetailClientProps {
  post: Post;
}

export default function PostDetailClient({ post }: PostDetailClientProps) {
  const router = useRouter();

  // 編集状態の管理
  const [title, setTitle] = useState(post.generatedTitle);
  const [hook, setHook] = useState(post.generatedHook);
  const [body, setBody] = useState(post.generatedBody);
  const [short, setShort] = useState(post.generatedShort);
  const [cta, setCta] = useState(post.generatedCta);
  const [tagsInput, setTagsInput] = useState(post.tags.join(" "));
  const [imageConcept, setImageConcept] = useState(post.imageConcept);

  // メタデータ (入力条件)
  const [direction, setDirection] = useState(post.direction);
  const [theme, setTheme] = useState(post.theme);
  const [snsType, setSnsType] = useState(post.snsType);
  const [tone, setTone] = useState(post.tone);
  const [targetAudience, setTargetAudience] = useState(post.targetAudience || "");
  const [ctaType, setCtaType] = useState(post.ctaType || "");
  const [additionalInfo, setAdditionalInfo] = useState(post.additionalInfo || "");

  // アクション状態
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // 変更の保存 (更新)
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const tagsArray = tagsInput
      .split(/\s+/)
      .filter((tag) => tag.trim() !== "")
      .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));

    const res = await updatePostAction(post.id, {
      direction,
      theme,
      snsType,
      tone,
      targetAudience: targetAudience || undefined,
      ctaType: ctaType || undefined,
      additionalInfo: additionalInfo || undefined,
      
      generatedTitle: title,
      generatedHook: hook,
      generatedBody: body,
      generatedShort: short,
      generatedCta: cta,
      generatedTags: tagsArray,
      imageConcept,
    });

    setLoading(false);
    if (res.success) {
      setMessage("変更内容を保存しました！");
      setTimeout(() => setMessage(null), 3000);
      router.refresh();
    } else {
      setError(res.error || "保存に失敗しました。");
    }
  };

  // 複製 (新規データとして保存して編集画面へ遷移)
  const handleDuplicate = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const tagsArray = tagsInput
      .split(/\s+/)
      .filter((tag) => tag.trim() !== "")
      .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));

    const params = {
      direction,
      theme,
      snsType,
      tone,
      targetAudience: targetAudience || undefined,
      ctaType: ctaType || undefined,
      additionalInfo: additionalInfo || undefined,
    };

    const content = {
      title: `${title} (コピー)`,
      hook,
      body,
      short,
      cta,
      tags: tagsArray,
      imageConcept,
    };

    const res = await savePostAction(params, content);
    setLoading(false);

    if (res.success && res.id) {
      setMessage("投稿を複製しました！新しい複製データに移動します。");
      setTimeout(() => {
        router.push(`/posts/${res.id}`);
      }, 1500);
    } else {
      setError(res.error || "複製に失敗しました。");
    }
  };

  // 削除
  const handleDelete = async () => {
    if (!confirm("この投稿案を完全に削除してもよろしいですか？")) {
      return;
    }

    setLoading(true);
    setError(null);
    
    const res = await deletePostAction(post.id);
    setLoading(false);

    if (res.success) {
      router.push("/posts");
    } else {
      setError(res.error || "削除に失敗しました。");
    }
  };

  return (
    <div className="space-y-6">
      {/* ナビゲーション */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/posts"
          className="inline-flex items-center space-x-1 text-sm font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>一覧へ戻る</span>
        </Link>
        <div className="flex space-x-2">
          {/* 削除ボタン */}
          <button
            onClick={handleDelete}
            disabled={loading}
            className="inline-flex items-center space-x-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition-all hover:bg-red-100 active:scale-95 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            <span>削除</span>
          </button>
          {/* 複製ボタン */}
          <button
            onClick={handleDuplicate}
            disabled={loading}
            className="inline-flex items-center space-x-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-50"
          >
            <Copy className="h-4 w-4" />
            <span>複製して新規編集</span>
          </button>
          {/* 保存ボタン */}
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="inline-flex items-center space-x-1 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>変更を保存</span>
          </button>
        </div>
      </div>

      {/* ステータスメッセージ */}
      {error && (
        <div className="flex items-start space-x-2.5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="flex items-center space-x-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800 animate-fade-in">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* メイン編集エリア（左カラム） */}
        <div className="space-y-4 lg:col-span-8">
          {/* タイトル */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400">タイトル</label>
              <CopyButton text={title} />
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* 冒頭フック */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400">冒頭フック</label>
              <CopyButton text={hook} />
            </div>
            <input
              type="text"
              value={hook}
              onChange={(e) => setHook(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* 本文 */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400">本文</label>
              <CopyButton text={body} />
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none leading-relaxed font-sans"
            />
          </div>

          {/* 短文版 */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400">短文版（Instagramキャプション等）</label>
              <CopyButton text={short} />
            </div>
            <textarea
              value={short}
              onChange={(e) => setShort(e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400">CTA文</label>
              <CopyButton text={cta} />
            </div>
            <input
              type="text"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* タグ */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400">ハッシュタグ案 (スペース区切り)</label>
              <CopyButton text={tagsInput} />
            </div>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="例: #終活 #身元保証 #老後不安"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* 画像・動画構成案 */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400">画像・動画構成案 / 撮影指示</label>
              <CopyButton text={imageConcept} />
            </div>
            <textarea
              value={imageConcept}
              onChange={(e) => setImageConcept(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-600 focus:border-emerald-500 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* 条件情報（右カラム） */}
        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-700">生成時の入力条件</h2>
              <span className="flex items-center text-xs text-slate-400">
                <Calendar className="mr-1 h-3 w-3" />
                {new Date(post.createdAt).toLocaleDateString("ja-JP")}
              </span>
            </div>

            {/* SNS種別 */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">投稿先SNS</span>
              <select
                value={snsType}
                onChange={(e) => setSnsType(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700"
              >
                <option value="Note">Note</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
              </select>
            </div>

            {/* 方向性 */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">方向性</span>
              <input
                type="text"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700"
              />
            </div>

            {/* テーマ */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">テーマ</span>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700"
              />
            </div>

            {/* 文体トーン */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">文体・トーン</span>
              <input
                type="text"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700"
              />
            </div>

            {/* 対象読者 */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">対象読者</span>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="指定なし"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700"
              />
            </div>

            {/* CTA種別 */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">CTA種別</span>
              <input
                type="text"
                value={ctaType}
                onChange={(e) => setCtaType(e.target.value)}
                placeholder="指定なし"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700"
              />
            </div>

            {/* 追加指示 */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">追加指示・メモ</span>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                rows={3}
                placeholder="なし"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
