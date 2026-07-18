"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle, Search, Calendar, Filter } from "lucide-react";

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

interface PostListClientProps {
  initialPosts: Post[];
}

export default function PostListClient({ initialPosts }: PostListClientProps) {
  const [search, setSearch] = useState("");
  const [selectedSns, setSelectedSns] = useState("All");
  const [selectedTheme, setSelectedTheme] = useState("All");

  // ユニークなテーマの抽出
  const allThemes = Array.from(new Set(initialPosts.map((p) => p.theme)));

  // フィルタリング処理
  const filteredPosts = initialPosts.filter((post) => {
    const matchesSearch =
      post.generatedTitle.toLowerCase().includes(search.toLowerCase()) ||
      post.generatedHook.toLowerCase().includes(search.toLowerCase()) ||
      post.generatedBody.toLowerCase().includes(search.toLowerCase());

    const matchesSns = selectedSns === "All" || post.snsType === selectedSns;
    const matchesTheme = selectedTheme === "All" || post.theme === selectedTheme;

    return matchesSearch && matchesSns && matchesTheme;
  });

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">保存済み投稿一覧</h1>
          <p className="text-xs text-slate-400 mt-1">保存された投稿案の閲覧・編集・複製・削除が行えます。</p>
        </div>
        <Link
          href="/posts/new"
          className="inline-flex items-center space-x-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95"
        >
          <PlusCircle className="h-4 w-4" />
          <span>新規作成</span>
        </Link>
      </div>

      {/* 検索・フィルターエリア */}
      <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        {/* 検索バー */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="タイトルや本文からキーワード検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* フィルタータグ */}
        <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            <span>絞り込み:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {/* SNS */}
            <select
              value={selectedSns}
              onChange={(e) => setSelectedSns(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600 focus:outline-none"
            >
              <option value="All">すべてのSNS</option>
              <option value="Note">Note</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
            </select>

            {/* テーマ */}
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600 focus:outline-none"
            >
              <option value="All">すべてのテーマ</option>
              {allThemes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 件数表示 */}
      <div className="text-xs font-semibold text-slate-400">
        該当件数: {filteredPosts.length} 件 / 全 {initialPosts.length} 件
      </div>

      {/* 投稿一覧リスト */}
      {filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-400">
          <Search className="h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-medium">条件に一致する投稿が見つかりません</p>
          <p className="mt-1 text-xs text-slate-400">検索キーワードを変更するか、フィルターをリセットしてください。</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="group block rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="space-y-1.5">
                  {/* メタタグ */}
                  <div className="flex flex-wrap items-center gap-1.5">
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

                {/* 更新日時 */}
                <div className="flex items-center space-x-1 text-xs text-slate-400 sm:self-start">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {new Date(post.updatedAt).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
