"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Star,
  Eye,
  BarChart3,
  ArrowRight,
  Flame,
  Clock,
  Award,
  Zap,
  Target,
  Activity,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  ticker: string;
  currentPrice: string;
  priceChange: string;
  priceChangePercent: string;
  totalRatings: number;
  hasDividendBadge: boolean;
  category: string;
}

interface WatchlistItem {
  id: number;
  product: Product;
}

interface RatingItem {
  id: number;
  productId: number;
  productName: string;
  productTicker: string;
  weightedScore: string;
  createdAt: string;
}

export default function ConsumerDashboard() {
  const { user } = useAuthStore();
  const [topMovers, setTopMovers] = useState<Product[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [recentRatings, setRecentRatings] = useState<RatingItem[]>([]);
  const [stats, setStats] = useState({
    totalRatings: 0,
    watchlistCount: 0,
    avgScore: 0,
  });
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [localTrends, setLocalTrends] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [moversRes, watchlistRes, ratingsRes, recsRes, localRes] = await Promise.all([
          fetch("/api/market/ticker"),
          fetch("/api/consumer/watchlist"),
          fetch("/api/consumer/ratings?limit=5"),
          fetch("/api/consumer/recommendations?type=preference&limit=4"),
          fetch("/api/consumer/recommendations?type=location&limit=4"),
        ]);

        if (moversRes.ok) {
          const moversData = await moversRes.json();
          setTopMovers(moversData.products?.slice(0, 5) || []);
        }

        if (watchlistRes.ok) {
          const watchlistData = await watchlistRes.json();
          setWatchlist(watchlistData.watchlist || []);
          setStats((prev) => ({
            ...prev,
            watchlistCount: watchlistData.watchlist?.length || 0,
          }));
        }

        if (ratingsRes.ok) {
          const ratingsData = await ratingsRes.json();
          setRecentRatings(ratingsData.ratings || []);
          setStats((prev) => ({
            ...prev,
            totalRatings: ratingsData.total || 0,
            avgScore: ratingsData.avgScore || 0,
          }));
        }

        if (recsRes.ok) {
          const recsData = await recsRes.json();
          setRecommendedProducts(recsData.products || []);
        }

        if (localRes.ok) {
          const localData = await localRes.json();
          setLocalTrends(localData.products || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-muted)] text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6 md:p-8 pb-28 md:pb-8 max-w-[1400px] mx-auto">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <Activity className="w-3 h-3 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">Market Open</span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-1">
              {getGreeting()}, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-[var(--text-secondary)]">
              Track the market, rate products, and make your voice heard.
            </p>
          </div>
          <Link href="/consumer/discover">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer">
              <Zap className="w-4 h-4" />
              Discover Products
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] p-5 hover:border-emerald-500/30 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
              +12% this week
            </span>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">
            {stats.totalRatings}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Ratings Given</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] p-5 hover:border-blue-500/30 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">
            {stats.watchlistCount}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Watching</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] p-5 hover:border-yellow-500/30 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 bg-yellow-500/10 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-xs font-medium text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-full">
              Your Average
            </span>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">
            {stats.avgScore.toFixed(1)}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Avg Score</div>
        </motion.div>
      </div>

      {/* Algorithms: Recommendations & Local Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Preference Algorithm: Recommended for You */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] overflow-hidden"
        >
          <div className="p-5 border-b border-[var(--border-primary)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">Recommended for You</h3>
                <p className="text-xs text-[var(--text-muted)]">Based on your preferences</p>
              </div>
            </div>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {recommendedProducts.length > 0 ? recommendedProducts.map((p) => (
              <Link key={p.id} href={`/product/${p.id}`}>
                <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-primary)] hover:border-emerald-500/30 transition-all group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold text-emerald-400 px-1.5 py-0.5 bg-emerald-500/10 rounded">
                      {p.ticker}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-[var(--text-muted)] group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <div className="text-sm font-bold text-[var(--text-primary)] truncate mb-1">
                    {p.name}
                  </div>
                  <div className="text-xs font-mono text-emerald-400">
                    {parseFloat(p.currentPrice).toFixed(2)}
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-2 py-8 text-center text-xs text-[var(--text-muted)]">
                Start rating to get personalized recommendations
              </div>
            )}
          </div>
        </motion.div>

        {/* Location Algorithm: Local Trends */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] overflow-hidden"
        >
          <div className="p-5 border-b border-[var(--border-primary)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">Trending Locally</h3>
                <p className="text-xs text-[var(--text-muted)]">Popular in your region</p>
              </div>
            </div>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {localTrends.length > 0 ? localTrends.map((p) => (
              <Link key={p.id} href={`/product/${p.id}`}>
                <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-primary)] hover:border-blue-500/30 transition-all group">
                  <div className="flex items-center justify-between mb-2">
                     <span className="font-mono text-[10px] font-bold text-blue-400 px-1.5 py-0.5 bg-blue-500/10 rounded">
                      {p.ticker}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-[var(--text-muted)] group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="text-sm font-bold text-[var(--text-primary)] truncate mb-1">
                    {p.name}
                  </div>
                  <div className="text-xs font-mono text-blue-400">
                    {parseFloat(p.currentPrice).toFixed(2)}
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-2 py-8 text-center text-xs text-[var(--text-muted)]">
                Local market data settling in...
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Top Movers & Watchlist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Movers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-[var(--border-primary)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-[var(--text-primary)]">Top Movers</h2>
                  <p className="text-xs text-[var(--text-muted)]">Trending products today</p>
                </div>
              </div>
              <Link
                href="/consumer/discover"
                className="flex items-center gap-1 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-[var(--border-primary)]">
              {topMovers.map((product, index) => {
                const change = parseFloat(product.priceChange || "0");
                const isPositive = change > 0;
                return (
                  <Link key={product.id} href={`/product/${product.id}`}>
                    <div className="flex items-center justify-between p-4 hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-[var(--text-muted)] bg-[var(--bg-tertiary)] rounded-lg">
                          {index + 1}
                        </span>
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                          <span className="font-mono font-bold text-emerald-400 text-xs">
                            {product.ticker.slice(0, 3)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-emerald-400">
                              {product.ticker}
                            </span>
                            {product.hasDividendBadge && (
                              <Award className="w-4 h-4 text-emerald-400" />
                            )}
                          </div>
                          <span className="text-sm text-[var(--text-muted)]">
                            {product.name}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-[var(--text-primary)]">
                          {parseFloat(product.currentPrice).toFixed(2)}
                        </div>
                        <div
                          className={cn(
                            "flex items-center justify-end gap-1 text-sm",
                            isPositive ? "text-emerald-400" : "text-red-400"
                          )}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {isPositive && "+"}
                          {change.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
              {topMovers.length === 0 && (
                <div className="p-8 text-center">
                  <Flame className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
                  <p className="text-[var(--text-muted)]">No market data available</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Watchlist Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-[var(--border-primary)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-[var(--text-primary)]">Your Watchlist</h2>
                  <p className="text-xs text-[var(--text-muted)]">Products you&apos;re tracking</p>
                </div>
              </div>
              <Link
                href="/consumer/watchlist"
                className="flex items-center gap-1 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Manage
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {watchlist.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 p-5">
                {watchlist.slice(0, 4).map((item) => {
                  const change = parseFloat(item.product.priceChange || "0");
                  const isPositive = change >= 0;
                  return (
                    <Link key={item.id} href={`/product/${item.product.id}`}>
                      <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-primary)] hover:border-emerald-500/30 transition-all cursor-pointer group">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono font-bold text-emerald-400 text-sm">
                            {item.product.ticker}
                          </span>
                          <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-emerald-400 transition-colors" />
                        </div>
                        <div className="text-xl font-bold text-[var(--text-primary)] mb-1">
                          {parseFloat(item.product.currentPrice).toFixed(2)}
                        </div>
                        <div
                          className={cn(
                            "flex items-center gap-1 text-sm",
                            isPositive ? "text-emerald-400" : "text-red-400"
                          )}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {isPositive && "+"}
                          {change.toFixed(2)}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-14 h-14 bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-7 h-7 text-[var(--text-muted)]" />
                </div>
                <h3 className="font-medium text-[var(--text-primary)] mb-1">No products in watchlist</h3>
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  Start tracking products you&apos;re interested in
                </p>
                <Link href="/consumer/discover">
                  <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
                    Discover Products
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column - Recent Ratings */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] overflow-hidden sticky top-24"
          >
            <div className="flex items-center justify-between p-5 border-b border-[var(--border-primary)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-[var(--text-primary)]">Recent Ratings</h2>
                  <p className="text-xs text-[var(--text-muted)]">Your latest activity</p>
                </div>
              </div>
              <Link
                href="/consumer/my-ratings"
                className="flex items-center gap-1 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {recentRatings.length > 0 ? (
              <div className="divide-y divide-[var(--border-primary)]">
                {recentRatings.map((rating) => (
                  <Link key={rating.id} href={`/product/${rating.productId}`}>
                    <div className="p-4 hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                          <Star className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-semibold text-emerald-400 text-sm">
                              {rating.productTicker}
                            </span>
                            <span className="font-bold text-[var(--text-primary)]">
                              {parseFloat(rating.weightedScore).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-[var(--text-muted)] truncate">
                              {rating.productName}
                            </span>
                            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-14 h-14 bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-7 h-7 text-[var(--text-muted)]" />
                </div>
                <h3 className="font-medium text-[var(--text-primary)] mb-1">No ratings yet</h3>
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  Rate your first product
                </p>
                <Link href="/consumer/discovery">
                  <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
                    Start Rating
                  </button>
                </Link>
              </div>
            )}

            {/* Quick Tip */}
            <div className="p-4 border-t border-[var(--border-primary)] bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[var(--text-primary)] mb-1">Pro Tip</h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Rate products consistently to build your reputation and unlock exclusive features.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
