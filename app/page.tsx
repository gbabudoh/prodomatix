"use client";

import { useEffect } from "react";
import { useMarketStore } from "@/store/market-store";
import { useAuthStore } from "@/store/auth-store";
import { TickerTape } from "@/components/market/ticker-tape";
import { ProdoCard } from "@/components/market/prodo-card";
import { LiveFeed } from "@/components/market/live-feed";
import { TopMovers } from "@/components/market/top-movers";
import { SearchFilter } from "@/components/market/search-filter";
import { MarketStats } from "@/components/market/market-stats";
import { AdFlowBillboard } from "@/components/market/adflow-billboard";
import { Button } from "@/components/shared/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { motion } from "framer-motion";
import Link from "next/link";
import { LogIn, UserPlus, LayoutDashboard, User } from "lucide-react";

export default function TradingFloor() {
  const { getFilteredProducts } = useMarketStore();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const products = getFilteredProducts();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Determine dashboard link based on user role
  const dashboardLink = user?.role === "owner" ? "/dashboard" : "/consumer";

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header Bar */}
      <div className="bg-gray-900/80 border-b border-gray-800 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-white text-lg">Prodomatix</span>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle variant="icon" />
            {isAuthenticated ? (
              <>
                <Link href={dashboardLink}>
                  <Button variant="secondary" className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-sm text-gray-300 hidden sm:inline">{user?.name?.split(" ")[0]}</span>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Register</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Ticker Tape */}
      <TickerTape />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Stock Market
            </span>{" "}
            of Sentiment
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Rate products, track sentiment trends, and discover what the world
            really thinks. Your opinion moves the market.
          </p>
        </motion.div>

        {/* AdFlow Billboard */}
        <AdFlowBillboard />

        {/* Market Stats */}
        <div className="mb-8">
          <MarketStats />
        </div>

        {/* Top Movers */}
        <div className="mb-8">
          <TopMovers />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Grid */}
          <div className="lg:col-span-2 space-y-6">
            <SearchFilter />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product, index) => (
                <ProdoCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No products found matching your criteria.
                </p>
              </div>
            )}
          </div>

          {/* Live Feed Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <LiveFeed />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">P</span>
              </div>
              <span className="text-gray-400 text-sm">
                Prodomatix © 2026 — The Stock Market of Sentiment
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>Market Hours: 24/7</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Live Trading
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
