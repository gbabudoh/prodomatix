
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Users, 
  Store, 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  Zap,
  Activity
} from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
  { group: "Platform", items: [
    { name: "Overview", href: "/admin", icon: BarChart3 },
    { name: "System Health", href: "/admin/health", icon: Activity },
  ]},
  { group: "Management", items: [
    { name: "Brands", href: "/admin/brands", icon: Building2 },
    { name: "Retailers", href: "/admin/retailers", icon: Store },
    { name: "Users", href: "/admin/users", icon: Users },
  ]},
  { group: "Earnings", items: [
    { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  ]},
  { group: "Security", items: [
    { name: "Audit Logs", href: "/admin/logs", icon: ShieldCheck },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]}
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex h-16 items-center px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <span className="text-sm font-black uppercase tracking-tighter text-zinc-900 dark:text-zinc-50">
            Prodomatix <span className="text-indigo-600">Core</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {menuItems.map((group) => (
          <div key={group.group} className="mb-8 last:mb-0">
            <h3 className="mb-3 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                      isActive
                        ? "bg-white text-indigo-600 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-indigo-400 dark:ring-zinc-800"
                        : "text-zinc-500 hover:bg-white hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-zinc-500 transition-all hover:bg-white hover:text-red-600 dark:hover:bg-zinc-900 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
