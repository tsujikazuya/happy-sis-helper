"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generatePostAction, savePostAction, type GeneratedContent } from "@/app/actions/posts";
import { CopyButton } from "@/components/CopyButton";
import { 
  Sparkles, Save, RefreshCw, AlertCircle, CheckCircle, 
  ChevronRight, ArrowLeft, ArrowUpRight, MessageSquare 
} from "lucide-react";
import Link from "next/link";

export default function CreatePostClient() {
  const router = useRouter();

  // フォーム入力値
  const [direction, setDirection] = useState("共感型");
  const [customDirection, setCustomDirection] = useState("");
  
  const [theme, setTheme] = useState("誰にも頼れない老後");
  const [customTheme, setCustomTheme] = useState("");

  const [snsType, setSnsType] = useState("Note");

  const [tone, setTone] = useState("共感・寄り添い");
  const [customTone, setCustomTone] = useState("");

  const [targetAudience, setTargetAudience] = useState("");
  const [ctaType, setCtaType] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  // ステート管理
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // 送信パラメータの準備
  const getParams = () => {
    return {
      direction: direction === "カスタム" ? customDirection : direction,
      theme: theme === "カスタム" ? customTheme : theme,
      snsType,
      tone: tone === "カスタム" ? customTone : tone,
      targetAudience: targetAudience || undefined,
      ctaType: ctaType || undefined,
      additionalInfo: additionalInfo || undefined,
    };
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSavedSuccess(false);

    const params = getParams();

    // バリデーション
    if (!params.direction) {
      setError("方向性を指定してください（カスタム入力の場合もテキストが必要です）。");
      setLoading(false);
      return;
    }
    if (!params.theme) {
      setError("テーマを指定してください（カスタム入力の場合もテキストが必要です）。");
      setLoading(false);
      return;
    }
    if (!params.tone) {
      setError("トーン・文体を指定してください（カスタム入力の場合もテキストが必要です）。");
      setLoading(false);
      return;
    }

    const res = await generatePostAction(params);
    setLoading(false);

    if (res.success && res.data) {
      setGenerated(res.data);
    } else {
      setError(res.error || "生成に失敗しました。時間をおいて再度お試しください。");
    }
  };

  const handleSave = async () => {
    if (!generated) return;
    setLoading(true);
    setError(null);

    const params = getParams();
    const res = await savePostAction(params, generated);
    setLoading(false);

    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => {
        router.push("/posts");
      }, 1500);
    } else {
      setError(res.error || "保存に失敗しました。");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center space-x-1 text-sm font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>ホームへ戻る</span>
        </Link>
        <h1 className="text-xl font-bold text-slate-800">新規投稿作成</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* 入力フォーム */}
        <form
          onSubmit={handleGenerate}
          className="space-y-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-5"
        >
          {/* 方向性 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">
              投稿の方向性 <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["共感型", "終活導線型", "カスタム"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDirection(opt)}
                  className={`rounded-xl py-2.5 text-xs font-semibold border transition-all ${
                    direction === opt
                      ? "border-emerald-600 bg-emerald-50/50 text-emerald-700 font-bold"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {direction === "カスタム" && (
              <input
                type="text"
                placeholder="例: セミナー募集告知用、活動報告など"
                value={customDirection}
                onChange={(e) => setCustomDirection(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            )}
          </div>

          {/* 投稿テーマ */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">
              投稿テーマ <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                "誰にも頼れない老後",
                "入院できない高齢者",
                "亡くなった後に困ること",
                "身元保証",
                "孤独死",
                "カスタム",
              ].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setTheme(opt)}
                  className={`rounded-xl py-2 text-xs font-semibold border transition-all truncate px-1 ${
                    theme === opt
                      ? "border-emerald-600 bg-emerald-50/50 text-emerald-700 font-bold"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {theme === "カスタム" && (
              <input
                type="text"
                placeholder="例: 親の遺品整理、認知症への備えなど"
                value={customTheme}
                onChange={(e) => setCustomTheme(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            )}
          </div>

          {/* 投稿先SNS */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">
              投稿先SNS <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Note", "Instagram", "Facebook"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSnsType(opt)}
                  className={`rounded-xl py-2.5 text-xs font-semibold border transition-all ${
                    snsType === opt
                      ? opt === "Note"
                        ? "border-rose-500 bg-rose-50/50 text-rose-600 font-bold"
                        : opt === "Instagram"
                        ? "border-pink-500 bg-pink-50/50 text-pink-600 font-bold"
                        : "border-blue-600 bg-blue-50/50 text-blue-700 font-bold"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 文体・トーン */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">
              文体・トーン <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                "共感・寄り添い",
                "情報・教育",
                "ストーリー",
                "行動促進（CTA）",
                "カスタム",
              ].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setTone(opt)}
                  className={`rounded-xl py-2 text-xs font-semibold border transition-all truncate px-1 ${
                    tone === opt
                      ? "border-emerald-600 bg-emerald-50/50 text-emerald-700 font-bold"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {tone === "カスタム" && (
              <input
                type="text"
                placeholder="例: 親しみやすい話し言葉、やや厳粛なトーンなど"
                value={customTone}
                onChange={(e) => setCustomTone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            )}
          </div>

          {/* 対象読者 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">対象読者 (任意)</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="">指定なし</option>
              <option value="高齢者本人">高齢者本人</option>
              <option value="家族">家族・子ども世代</option>
              <option value="支援者">支援者・福祉専門職</option>
            </select>
          </div>

          {/* CTA種別 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">CTA種別 (任意)</label>
            <select
              value={ctaType}
              onChange={(e) => setCtaType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="">指定なし</option>
              <option value="問い合わせ">資料請求・お問い合わせへの誘導</option>
              <option value="相談予約">無料個別相談の予約フォームへの誘導</option>
              <option value="講座案内">終活講座・セミナー案内への誘導</option>
              <option value="LINE誘導">公式LINE友だち登録への誘導</option>
            </select>
          </div>

          {/* 追加指示 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">追加指示 (任意)</label>
            <textarea
              placeholder="例: 「明るい未来を想像できる内容に」「最初は具体的な事例から始めて」「相談窓口が無料であることを強調して」など"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* 生成ボタン */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3 text-sm font-bold text-white shadow-md transition-all hover:brightness-105 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>生成中（お待ちください）...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>AI投稿文を生成する</span>
              </>
            )}
          </button>
        </form>

        {/* 生成結果プレビューエリア */}
        <div className="lg:col-span-7">
          {error && (
            <div className="mb-4 flex items-start space-x-2.5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {savedSuccess && (
            <div className="mb-4 flex items-center space-x-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>投稿案を下書きに保存しました！一覧に移動します。</span>
            </div>
          )}

          {!generated && !loading && (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-8 text-center text-slate-400">
              <Sparkles className="h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm font-medium">条件を設定して「AI投稿文を生成する」を押してください</p>
              <p className="mt-1 text-xs text-slate-400">プロンプトには自動的に「断定を避け、寄り添う表現にする」指示が含まれます。</p>
            </div>
          )}

          {loading && !generated && (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-8 text-center">
              <div className="relative flex h-12 w-12 items-center justify-center">
                <div className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-20" />
                <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
              </div>
              <p className="mt-4 text-sm font-bold text-slate-600">AIがSNS投稿文を考案しています...</p>
              <p className="mt-1 text-xs text-slate-400">10〜15秒ほどかかる場合があります。</p>
            </div>
          )}

          {generated && (
            <div className={`space-y-4 ${loading ? "opacity-50 pointer-events-none" : ""}`}>
              {/* 操作ヘッダー */}
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
                <span className="text-xs font-bold text-slate-500">生成結果プレビュー</span>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={loading || savedSuccess}
                    className="inline-flex items-center space-x-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>下書き保存</span>
                  </button>
                </div>
              </div>

              {/* タイトル案 */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">タイトル案</span>
                  <CopyButton text={generated.title} label="タイトル" />
                </div>
                <div className="text-base font-bold text-slate-800 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  {generated.title}
                </div>
              </div>

              {/* 冒頭フック */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">冒頭フック</span>
                  <CopyButton text={generated.hook} label="フック" />
                </div>
                <div className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3 border border-slate-100 italic leading-relaxed">
                  {generated.hook}
                </div>
              </div>

              {/* 本文 */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">本文</span>
                  <CopyButton text={generated.body} label="本文" />
                </div>
                <div className="whitespace-pre-wrap text-sm text-slate-700 bg-slate-50 rounded-xl p-3 border border-slate-100 leading-relaxed font-sans">
                  {generated.body}
                </div>
              </div>

              {/* 短文版 */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">短文版（Instagramキャプション等）</span>
                  <CopyButton text={generated.short} label="短文版" />
                </div>
                <div className="whitespace-pre-wrap text-sm text-slate-700 bg-slate-50 rounded-xl p-3 border border-slate-100 leading-relaxed">
                  {generated.short}
                </div>
              </div>

              {/* CTA文 */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">CTA文</span>
                  <CopyButton text={generated.cta} label="CTA" />
                </div>
                <div className="text-sm font-medium text-slate-700 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  {generated.cta}
                </div>
              </div>

              {/* ハッシュタグ */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">ハッシュタグ案</span>
                  <CopyButton text={generated.tags.join(" ")} label="タグ" />
                </div>
                <div className="flex flex-wrap gap-1.5 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  {generated.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                      {tag.startsWith("#") ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              </div>

              {/* ビジュアル構成案 */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">画像・動画構成案 / 撮影指示</span>
                  <CopyButton text={generated.imageConcept} label="構成案" />
                </div>
                <div className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100 leading-relaxed">
                  {generated.imageConcept}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
