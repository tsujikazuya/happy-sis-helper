"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, History } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: "ホーム", href: "/", icon: Home },
    { name: "投稿作成", href: "/posts/new", icon: PlusCircle },
    { name: "履歴一覧", href: "/posts", icon: History },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-100 bg-white/80 pb-safe shadow-lg backdrop-blur-md md:bottom-auto md:top-0 md:border-b md:border-t-0 md:shadow-sm">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex h-16 items-center justify-around md:justify-between">
          {/* Logo / Brand Name (Only visible on desktop) */}
          <div className="hidden items-center space-x-2 md:flex">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-xl font-bold text-transparent">
              はっぴぃand 投稿サポーター
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex w-full items-center justify-around md:w-auto md:space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center space-y-1 py-1 text-xs font-medium transition-all duration-200 hover:text-emerald-600 md:flex-row md:space-x-2 md:space-y-0 md:py-2 md:text-sm ${
                    isActive
                      ? "text-emerald-600 scale-105"
                      : "text-slate-500"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5px]" : "stroke-2"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
