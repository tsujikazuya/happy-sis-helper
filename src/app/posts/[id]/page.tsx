import { getPostByIdAction } from "@/app/actions/posts";
import PostDetailClient from "@/components/PostDetailClient";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export const revalidate = 0; // Ensure fresh data on details view

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { id } = await params;
  const post = await getPostByIdAction(id);
  return {
    title: post ? `${post.generatedTitle} | 編集` : "投稿が見つかりません",
  };
}

export default async function PostDetailPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = await getPostByIdAction(id);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h1 className="mt-4 text-xl font-bold text-slate-800 font-sans">指定された投稿が見つかりません</h1>
        <p className="mt-2 text-sm text-slate-500">すでに削除されたか、無効なURLの可能性があります。</p>
        <Link
          href="/posts"
          className="mt-6 inline-flex items-center space-x-1 rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>履歴一覧に戻る</span>
        </Link>
      </div>
    );
  }

  return <PostDetailClient post={post} />;
}
