"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search,
  Heart,
  BarChart3,
  User,
  LogOut,
  TrendingUp,
  Bell,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Shield,
  Activity,
  Rocket,
  Gem,
  Trophy,
  Zap,
  Briefcase,
} from "lucide-react";

const navItems = [
  { href: "/consumer", label: "Dashboard", icon: Home, description: "Overview & stats" },
  { href: "/consumer/portfolio", label: "Portfolio", icon: Briefcase, description: "Your asset holdings" },
  { href: "/consumer/discovery", label: "Discovery", icon: Search, description: "Find products" },
  { href: "/consumer/leaderboard", label: "Leaderboard", icon: Trophy, description: "Top scouts & ROI" },
  { href: "/consumer/rewards", label: "Rewards", icon: Gem, description: "Alpha Wallet & Dividends" },
  { href: "/consumer/npb", label: "NPB", icon: Rocket, description: "New Products Bank" },
  { href: "/consumer/nsb", label: "NSB", icon: Gem, description: "New Services Bank" },
  { href: "/consumer/watchlist", label: "Watchlist", icon: Heart, description: "Tracked items" },
  { href: "/consumer/my-ratings", label: "My Ratings", icon: BarChart3, description: "Rating history" },
  { href: "/consumer/profile", label: "Profile", icon: User, description: "Account settings" },
];

export default function ConsumerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications] = useState(3);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Track that user is in consumer dashboard for back navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("lastVisitedPath", pathname);
    }
  }, [pathname]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?returnTo=/consumer");
    }
    if (!isLoading && isAuthenticated && user?.role === "owner") {
      router.push("/business/dashboard");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center animate-pulse">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[var(--bg-primary)] animate-ping" />
          </div>
          <p className="text-[var(--text-muted)] text-sm">Loading your dashboard...</p>
        </div>
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

  const isActive = (href: string) => {
    if (href === "/consumer") return pathname === "/consumer";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Mobile Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <Link href="/consumer" className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[var(--bg-secondary)] animate-pulse" />
                </div>
                <div className="hidden sm:block">
                  <span className="font-bold text-[var(--text-primary)] text-lg tracking-tight">Prodomatix</span>
                  <span className="block text-[10px] text-[var(--text-muted)] font-medium tracking-widest uppercase">Consumer Portal</span>
                </div>
              </Link>
            </div>

            {/* Center - Alpha Tracker (Desktop) */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/consumer/leaderboard">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-1.5 rounded-2xl border backdrop-blur-md transition-all cursor-pointer shadow-lg",
                    user?.tier === 'gold' ? "bg-yellow-500/10 border-yellow-500/30 shadow-yellow-500/10" :
                    user?.tier === 'silver' ? "bg-slate-400/10 border-slate-400/30 shadow-slate-400/10" :
                    "bg-emerald-500/10 border-emerald-500/30 shadow-emerald-500/10"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center relative",
                    user?.tier === 'gold' ? "bg-yellow-500/20" :
                    user?.tier === 'silver' ? "bg-slate-400/20" :
                    "bg-emerald-500/20"
                  )}>
                    <Zap className={cn(
                      "w-4 h-4",
                      user?.tier === 'gold' ? "text-yellow-400" :
                      user?.tier === 'silver' ? "text-slate-300" :
                      "text-emerald-400"
                    )} />
                    <div className={cn(
                      "absolute -inset-1 rounded-xl animate-pulse opacity-20",
                      user?.tier === 'gold' ? "bg-yellow-400" :
                      user?.tier === 'silver' ? "bg-slate-400" :
                      "bg-emerald-400"
                    )} />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest leading-none">Alpha</span>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md",
                        user?.tier === 'gold' ? "bg-yellow-500/20 text-yellow-400" :
                        user?.tier === 'silver' ? "bg-slate-400/20 text-slate-300" :
                        "bg-emerald-500/20 text-emerald-400"
                      )}>
                        {user?.tier || 'Bronze'}
                      </span>
                    </div>
                    <div className="text-lg font-black font-mono tracking-tighter leading-none mt-0.5">
                      {parseFloat(user?.alphaScore || '0').toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Mobile Alpha Tracker */}
              <Link href="/consumer/leaderboard" className="lg:hidden">
                <div className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border",
                  user?.tier === 'gold' ? "bg-yellow-500/10 border-yellow-500/20" :
                  user?.tier === 'silver' ? "bg-slate-400/10 border-slate-400/20" :
                  "bg-emerald-500/10 border-emerald-500/20"
                )}>
                  <Zap className={cn(
                    "w-3.5 h-3.5",
                    user?.tier === 'gold' ? "text-yellow-400" :
                    user?.tier === 'silver' ? "text-slate-300" :
                    "text-emerald-400"
                  )} />
                  <span className="text-sm font-black font-mono tracking-tighter">
                    {parseFloat(user?.alphaScore || '0').toLocaleString()}
                  </span>
                </div>
              </Link>

              <ThemeToggle variant="icon" />
              
              {/* Notifications */}
              <button className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors cursor-pointer">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {notifications}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-2 px-2 md:px-3 py-2 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-primary)]">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <span className="text-sm font-medium text-[var(--text-primary)] block leading-tight">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Consumer
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 lg:w-72 h-[calc(100vh-64px)] sticky top-16 bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] overflow-y-auto">
          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                      active
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-transparent"
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                      active ? "bg-emerald-500/20" : "bg-[var(--bg-tertiary)] group-hover:bg-[var(--bg-primary)]"
                    )}>
                      <Icon className={cn("w-5 h-5", active ? "text-emerald-400" : "")} />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium block">{item.label}</span>
                      <span className="text-[11px] text-[var(--text-muted)]">{item.description}</span>
                    </div>
                    {active && <ChevronRight className="w-4 h-4 text-emerald-400" />}
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-[var(--border-primary)]">
              <div className="px-4 mb-3">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Quick Actions</span>
              </div>
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm">Trading Floor</span>
              </Link>
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-[var(--border-primary)]">
            {/* Pro Upgrade Card */}
            <div className="mb-4 p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-[var(--text-primary)]">Upgrade to Pro</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-3">Get advanced analytics and unlimited watchlist items.</p>
              <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
                Learn More
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-64px)] overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)]/95 backdrop-blur-xl border-t border-[var(--border-primary)] z-50 safe-area-pb">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[60px]",
                  active ? "text-emerald-400" : "text-[var(--text-muted)]"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  active ? "bg-emerald-500/20" : ""
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-72 bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] z-50 overflow-y-auto"
            >
              <div className="p-4 border-b border-[var(--border-primary)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-[var(--text-primary)]">Prodomatix</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <nav className="p-4">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                          active
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-[var(--border-primary)]">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
