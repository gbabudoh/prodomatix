"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useMarketStore } from "@/store/market-store";
import { useAuthStore } from "@/store/auth-store";
import { TickerTape } from "@/components/market/ticker-tape";
import { ProdoCard } from "@/components/market/prodo-card";

const LiveFeed = dynamic(
  () => import("@/components/market/live-feed").then((mod) => mod.LiveFeed),
  { ssr: false }
);

import { TopMovers } from "@/components/market/top-movers";
import { SearchFilter } from "@/components/market/search-filter";
import { MarketStats } from "@/components/market/market-stats";
import { AdFlowBillboard } from "@/components/market/adflow-billboard";
import { Button } from "@/components/shared/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Footer } from "@/components/shared/footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { LogIn, UserPlus, LayoutDashboard, User, TrendingUp, Activity, Zap, ChevronRight } from "lucide-react";

export default function TradingFloor() {
  const { getFilteredProducts } = useMarketStore();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const products = getFilteredProducts();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Track that user is on homepage for back navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("lastVisitedPath", "/");
    }
  }, []);

  const dashboardLink = user?.role === "owner" ? "/business/dashboard" : "/consumer";

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[var(--bg-secondary)] animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-[var(--text-primary)] text-lg tracking-tight">Prodomatix</span>
                <span className="block text-[10px] text-[var(--text-muted)] font-medium tracking-widest uppercase">Sentiment Exchange</span>
              </div>
            </Link>

            {/* Center Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/" className="px-4 py-2 text-sm font-medium text-emerald-400 bg-emerald-500/10 rounded-lg cursor-pointer">
                Markets
              </Link>
              {/* Portfolio & Analytics only visible to owners/business users */}
              {isAuthenticated && user?.role === "owner" && (
                <>
                  <Link href="/business/dashboard/portfolio" className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors cursor-pointer">
                    Portfolio
                  </Link>
                  <Link href="/business/dashboard/global" className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors cursor-pointer">
                    Analytics
                  </Link>
                </>
              )}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle variant="icon" />
              
              {isAuthenticated ? (
                <>
                  <Link href={dashboardLink}>
                    <Button variant="secondary" size="sm" className="hidden sm:flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-primary)]">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-sm font-medium text-[var(--text-primary)] block leading-tight">{user?.name?.split(" ")[0]}</span>
                      <span className="text-[10px] text-[var(--text-muted)] capitalize">{user?.role}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      <span className="hidden sm:inline">Get Started</span>
                      <span className="sm:hidden">Join</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Ticker Tape */}
      <TickerTape />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[var(--border-primary)]">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
              rotate: [0, -90, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px]" 
          />
        </div>
        
        <div className="relative max-w-[1400px] mx-auto px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6 relative group cursor-default">
                <div className="absolute inset-0 bg-emerald-400/5 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <Activity className="w-4 h-4 text-emerald-400 relative z-10" />
                <span className="text-sm font-medium text-emerald-400 relative z-10">Live Market Pulse</span>
                <div className="relative flex h-2 w-2 relative z-10">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-[1.1] mb-6">
                The{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Stock Market
                </span>
                <br />
                of Sentiment
              </h1>
              
              <p className="text-lg text-[var(--text-secondary)] max-w-lg mb-8 leading-relaxed">
                Track real-time product sentiment, analyze market trends, and make data-driven decisions with our enterprise-grade rating platform.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                    Start Trading
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="secondary" size="lg" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    View Demo
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-8 mt-10 pt-8 border-t border-[var(--border-primary)] relative">
                <div className="relative group">
                  <div className="text-2xl font-bold text-[var(--text-primary)] group-hover:text-emerald-400 transition-colors">10K+</div>
                  <div className="text-sm text-[var(--text-muted)]">Active Traders</div>
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    className="absolute -top-1 -right-4 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.6)]" 
                  />
                </div>
                <div className="relative group">
                  <div className="text-2xl font-bold text-[var(--text-primary)] group-hover:text-amber-400 transition-colors">500+</div>
                  <div className="text-sm text-[var(--text-muted)]">Products Listed</div>
                </div>
                <div className="relative group">
                  <div className="text-2xl font-bold text-emerald-400">99.9%</div>
                  <div className="text-sm text-[var(--text-muted)]">Uptime</div>
                  <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-emerald-400/50 to-transparent" />
                </div>
              </div>
            </motion.div>

            {/* Right Content - Market Stats Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <MarketStats />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile Market Stats */}
      <div className="lg:hidden px-6 py-8 border-b border-[var(--border-primary)]">
        <MarketStats />
      </div>

      {/* AdFlow Billboard */}
      <section className="max-w-[1400px] mx-auto px-6 py-8">
        <AdFlowBillboard />
      </section>

      {/* Top Movers */}
      <section className="max-w-[1400px] mx-auto px-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Market Movers</h2>
            <p className="text-sm text-[var(--text-muted)]">Top performing products in the last 24 hours</p>
          </div>
          <Link href="/login" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer">
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <TopMovers />
      </section>

      {/* Main Content Grid */}
      <section className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Products Grid */}
          <div className="xl:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Active Markets</h2>
                <p className="text-sm text-[var(--text-muted)]">{products.length} products available for trading</p>
              </div>
            </div>
            
            <SearchFilter />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product, index) => (
                <ProdoCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-16 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)]">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-[var(--text-muted)]" />
                </div>
                <p className="text-[var(--text-secondary)] font-medium">No products found</p>
                <p className="text-sm text-[var(--text-muted)] mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          {/* Live Feed Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-24">
              <LiveFeed />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
