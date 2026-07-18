import { getPostsAction } from "@/app/actions/posts";
import PostListClient from "@/components/PostListClient";

export const revalidate = 0; // Ensure fresh database list

export const metadata = {
  title: "履歴一覧 | はっぴぃand 投稿サポーター",
  description: "これまでに作成したSNS投稿案の一覧です。",
};

export default async function PostsPage() {
  const posts = await getPostsAction();
  return <PostListClient initialPosts={posts} />;
}
