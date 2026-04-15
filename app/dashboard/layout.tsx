"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Globe,
  Megaphone,
  Settings,
  TrendingUp,
  LogOut,
  Package,
  Bell,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/portfolio", label: "Portfolio", icon: Package },
  { href: "/dashboard/global", label: "Global Heat Map", icon: Globe },
  { href: "/dashboard/adflow", label: "AdFLOW", icon: Megaphone },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?returnTo=/dashboard");
    }
    if (!isLoading && isAuthenticated && user?.role === "consumer") {
      router.push("/consumer");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "owner") {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900/50 border-r border-gray-800 flex flex-col hidden md:flex">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg">Prodomatix</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors",
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-400">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">Business Owner</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors mt-2 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900/80 border-b border-gray-800 backdrop-blur-sm z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">Prodomatix</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle variant="icon" />
            <button className="p-2 text-gray-400 hover:text-white cursor-pointer">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-400">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto md:pt-0 pt-14">{children}</main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2",
                  isActive ? "text-emerald-400" : "text-gray-400"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
