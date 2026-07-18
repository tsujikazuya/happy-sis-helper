import Link from "next/link";
import { getPostsAction } from "@/app/actions/posts";
import { PlusCircle, FileText, Share2, Calendar, ArrowRight } from "lucide-react";

export const revalidate = 0; // Disable caching to ensure fresh DB data

export default async function Home() {
  const posts = await getPostsAction();
  const recentPosts = posts.slice(0, 3);

  // SNSごとの集計
  const noteCount = posts.filter((p) => p.snsType === "Note").length;
  const instaCount = posts.filter((p) => p.snsType === "Instagram").length;
  const fbCount = posts.filter((p) => p.snsType === "Facebook").length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ヒーローセクション */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-500 p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-lg space-y-4">
          <span className="inline-block rounded-full bg-emerald-500/30 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            はっぴぃandプロジェクト SNS運用サポート
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            寄り添う心と言葉を、
            <br />
            AIがカタチにします
          </h1>
          <p className="text-emerald-50 text-sm leading-relaxed md:text-base">
            終活・身元保証・老後の安心を届けるSNS投稿作成ツール。
            AIが最適な下書きを瞬時に生成し、日々の発信活動を強力に後押しします。
          </p>
          <div className="pt-2">
            <Link
              href="/posts/new"
              className="inline-flex items-center space-x-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-700 transition-all hover:bg-emerald-50 active:scale-95"
            >
              <PlusCircle className="h-5 w-5" />
              <span>新しい投稿を作成する</span>
            </Link>
          </div>
        </div>
        {/* 背景のグラデーションデコレーション */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-emerald-400/30 blur-3xl" />
      </div>

      {/* 統計ダッシュボード */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="text-xs font-semibold text-slate-400">保存済み投稿</div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-slate-800">{posts.length}</span>
            <span className="text-xs text-slate-500">件</span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="text-xs font-semibold text-rose-500">Note</div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-slate-800">{noteCount}</span>
            <span className="text-xs text-slate-500">件</span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="text-xs font-semibold text-pink-500">Instagram</div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-slate-800">{instaCount}</span>
            <span className="text-xs text-slate-500">件</span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="text-xs font-semibold text-blue-600">Facebook</div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-slate-800">{fbCount}</span>
            <span className="text-xs text-slate-500">件</span>
          </div>
        </div>
      </div>

      {/* 最近の下書き */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">最近作成した投稿案</h2>
          {posts.length > 3 && (
            <Link
              href="/posts"
              className="inline-flex items-center space-x-1 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
            >
              <span>すべて見る</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {recentPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
            <FileText className="h-10 w-10 text-slate-300" />
            <p className="mt-4 text-sm font-medium">作成済みの下書きがありません</p>
            <p className="mt-1 text-xs text-slate-400">投稿作成ページからAIによる生成を行ってください。</p>
            <Link
              href="/posts/new"
              className="mt-4 inline-flex items-center space-x-1 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200"
            >
              <span>最初の投稿を作成</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="group block rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${
                          post.snsType === "Note"
                            ? "bg-rose-50 text-rose-600"
                            : post.snsType === "Instagram"
                            ? "bg-pink-50 text-pink-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {post.snsType}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {post.theme}
                      </span>
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs text-emerald-600">
                        {post.tone}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 transition-colors group-hover:text-emerald-600">
                      {post.generatedTitle || "タイトルなし"}
                    </h3>
                    <p className="line-clamp-2 text-sm text-slate-500 leading-relaxed">
                      {post.generatedHook}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-slate-400 sm:self-start">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {new Date(post.updatedAt).toLocaleDateString("ja-JP", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
