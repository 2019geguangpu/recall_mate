"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "核心引擎", href: "/", icon: "🧠" },
  { name: "提醒管家", href: "/reminders", icon: "⏰" },
  { name: "购物助手", href: "/shopping", icon: "🛒" },
  { name: "健康管理", href: "/health", icon: "💊" },
  { name: "日程规划", href: "/schedule", icon: "📅" },
  { name: "财务管家", href: "/finance", icon: "💰" },
  { name: "学习伙伴", href: "/learning", icon: "📚" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <span className="text-xl font-bold text-foreground">
              {brand.name}
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-500 text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="rounded-md p-2 text-muted-foreground hover:bg-muted">
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

