import CreatePostClient from "@/components/CreatePostClient";

export const metadata = {
  title: "新規投稿作成 | はっぴぃand 投稿サポーター",
  description: "AIによるSNS投稿の下書きを作成します。",
};

export default function NewPostPage() {
  return <CreatePostClient />;
}
