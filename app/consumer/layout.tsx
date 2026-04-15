"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  Home,
  Search,
  Heart,
  BarChart3,
  User,
  LogOut,
  TrendingUp,
  Bell,
} from "lucide-react";

const navItems = [
  { href: "/consumer", label: "Home", icon: Home },
  { href: "/consumer/discover", label: "Discover", icon: Search },
  { href: "/consumer/watchlist", label: "Watchlist", icon: Heart },
  { href: "/consumer/my-ratings", label: "My Ratings", icon: BarChart3 },
  { href: "/consumer/profile", label: "Profile", icon: User },
];

export default function ConsumerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?returnTo=/consumer");
    }
    if (!isLoading && isAuthenticated && user?.role === "owner") {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "consumer") {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top Header */}
      <header className="bg-gray-900/80 border-b border-gray-800 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/consumer" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg">Prodomatix</span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle variant="icon" />
            <button className="p-2 text-gray-400 hover:text-white transition-colors relative cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <span className="text-emerald-400 font-medium text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-white text-sm hidden md:block">
                {user?.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900/50 border-r border-gray-800 min-h-[calc(100vh-57px)] hidden md:block">
          <nav className="p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 pt-4 border-t border-gray-800">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-57px)]">{children}</main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-emerald-400"
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
