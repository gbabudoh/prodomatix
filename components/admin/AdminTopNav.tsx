
"use client";

import React from "react";
import { Search, Bell, Command, Globe, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function AdminTopNav() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-8 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search brands, users, or retailers..."
            className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:ring-indigo-500/10"
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex h-10 items-center gap-2 rounded-xl border border-zinc-200 px-3 text-xs font-bold text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">Go to Site</span>
        </button>

        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-indigo-600 dark:border-zinc-950"></span>
        </button>

        <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black uppercase text-zinc-900 dark:text-zinc-50">{session?.user?.name || "Super Admin"}</p>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Master Account</p>
          </div>
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border-2 border-indigo-100 bg-indigo-50 dark:border-indigo-900/30 dark:bg-indigo-950">
            {session?.user?.image ? (
                <Image 
                  src={session.user.image} 
                  alt="Avatar" 
                  fill
                  className="object-cover" 
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center text-indigo-600">
                    <User className="h-5 w-5" />
                </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
