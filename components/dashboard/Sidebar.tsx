
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart3, 
  MessageSquare, 
  ShoppingBag, 
  CreditCard, 
  Settings, 
  FileText, 
  LogOut,
  Zap
} from "lucide-react";
import { signOut } from "next-auth/react";

const navigation = [
  {
    title: "Analytics",
    items: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { name: "Reports", href: "/dashboard/reports", icon: FileText },
    ]
  },
  {
    title: "Content",
    items: [
      { name: "Reviews", href: "/dashboard/reviews", icon: MessageSquare },
      { name: "Products", href: "/dashboard/products", icon: ShoppingBag },
    ]
  },
  {
    title: "Management",
    items: [
      { name: "Billing & Plans", href: "/dashboard/billing", icon: CreditCard },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-zinc-200 bg-zinc-50/50 backdrop-blur-xl dark:border-zinc-800 dark:bg-black/50">
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center border-b border-zinc-200 px-6 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <Zap className="h-6 w-6 fill-current" />
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Prodomatix</span>
        </div>
      </div>

      {/* Navigation Groups - Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div className="space-y-8">
          {navigation.map((group) => (
            <div key={group.title}>
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                          : "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200"
                      }`}
                    >
                      <item.icon className={`h-4 w-4 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Documentation Link */}
        <div className="mt-8">
           <Link
            href="/docs"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <BarChart3 className="h-4 w-4 text-zinc-400" />
            API Documentation
          </Link>
        </div>
      </div>

      {/* Bottom Actions - Sticky Footer */}
      <div className="shrink-0 border-t border-zinc-200 p-4 dark:border-zinc-800">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 cursor-pointer transition-all active:scale-95"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
