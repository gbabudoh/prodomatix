
"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, User } from "lucide-react";

export default function TopNav() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-xl dark:border-zinc-800 dark:bg-black/80">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">Prodomatix</span>
        {segments.map((segment, i) => (
          <div key={segment} className="flex items-center gap-2">
            <span>/</span>
            <span className={`capitalize ${i === segments.length - 1 ? "text-indigo-600 font-medium dark:text-indigo-400" : ""}`}>
              {segment}
            </span>
          </div>
        ))}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 rounded-lg border border-zinc-200 bg-zinc-50 pl-9 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          />
        </div>

        {/* Notifications */}
        <button className="relative rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer transition-all active:scale-95">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-black" />
        </button>

        {/* Profile */}
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 ring-2 ring-transparent hover:ring-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400 cursor-pointer transition-all active:scale-95">
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
