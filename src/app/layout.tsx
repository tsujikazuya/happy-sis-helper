import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "はっぴぃand 投稿サポーター | AI SNS投稿作成ツール",
  description: "終活・身元保証・老後不安に関するSNS投稿文をAIが生成・保存・管理できるWebアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-800 flex flex-col font-sans">
        <Navigation />
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-4 pb-20 md:pt-20 md:pb-8">
          {children}
        </main>
      </body>
    </html>
  );
}
