"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/shared/card";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch top movers
        const moversRes = await fetch("/api/market/ticker");
        if (moversRes.ok) {
          const moversData = await moversRes.json();
          setTopMovers(moversData.products?.slice(0, 5) || []);
        }

        // Fetch user's watchlist
        const watchlistRes = await fetch("/api/consumer/watchlist");
        if (watchlistRes.ok) {
          const watchlistData = await watchlistRes.json();
          setWatchlist(watchlistData.watchlist || []);
          setStats((prev) => ({
            ...prev,
            watchlistCount: watchlistData.watchlist?.length || 0,
          }));
        }

        // Fetch user's recent ratings
        const ratingsRes = await fetch("/api/consumer/ratings?limit=5");
        if (ratingsRes.ok) {
          const ratingsData = await ratingsRes.json();
          setRecentRatings(ratingsData.ratings || []);
          setStats((prev) => ({
            ...prev,
            totalRatings: ratingsData.total || 0,
            avgScore: ratingsData.avgScore || 0,
          }));
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
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 pb-24 md:pb-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Welcome back, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-gray-400">
          Track the market, rate products, and make your voice heard.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="text-center py-4">
            <div className="text-2xl font-bold text-emerald-400">
              {stats.totalRatings}
            </div>
            <div className="text-xs text-gray-500 mt-1">Ratings Given</div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="text-center py-4">
            <div className="text-2xl font-bold text-blue-400">
              {stats.watchlistCount}
            </div>
            <div className="text-xs text-gray-500 mt-1">Watching</div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="text-center py-4">
            <div className="text-2xl font-bold text-yellow-400">
              {stats.avgScore.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Avg Score</div>
          </Card>
        </motion.div>
      </div>

      {/* Top Movers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            Top Movers
          </h2>
          <Link
            href="/consumer/discover"
            className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-2">
          {topMovers.map((product, index) => {
            const change = parseFloat(product.priceChange || "0");
            const isPositive = change > 0;
            return (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card hover className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm w-6">
                      #{index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-400">
                          {product.ticker}
                        </span>
                        {product.hasDividendBadge && (
                          <Award className="w-3 h-3 text-emerald-400" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {product.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-white">
                      {parseFloat(product.currentPrice).toFixed(2)}
                    </div>
                    <div
                      className={cn(
                        "text-xs flex items-center justify-end gap-1",
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
                </Card>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Watchlist Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            Your Watchlist
          </h2>
          <Link
            href="/consumer/watchlist"
            className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            Manage <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {watchlist.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {watchlist.slice(0, 4).map((item) => (
              <Link key={item.id} href={`/product/${item.product.id}`}>
                <Card hover className="py-3">
                  <div className="font-mono font-bold text-emerald-400 text-sm">
                    {item.product.ticker}
                  </div>
                  <div className="text-lg font-bold text-white">
                    {parseFloat(item.product.currentPrice).toFixed(2)}
                  </div>
                  <div
                    className={cn(
                      "text-xs",
                      parseFloat(item.product.priceChange) >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    )}
                  >
                    {parseFloat(item.product.priceChange) >= 0 && "+"}
                    {parseFloat(item.product.priceChange).toFixed(2)}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <Eye className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No products in watchlist</p>
            <Link
              href="/consumer/discover"
              className="text-emerald-400 text-sm hover:underline mt-2 inline-block"
            >
              Discover products to watch
            </Link>
          </Card>
        )}
      </motion.div>

      {/* Recent Ratings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Recent Ratings
          </h2>
          <Link
            href="/consumer/my-ratings"
            className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {recentRatings.length > 0 ? (
          <div className="space-y-2">
            {recentRatings.map((rating) => (
              <Card key={rating.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-mono text-emerald-400 text-sm">
                      {rating.productTicker}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">
                    {parseFloat(rating.weightedScore).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">Your Score</div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <Star className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No ratings yet</p>
            <Link
              href="/consumer/discover"
              className="text-emerald-400 text-sm hover:underline mt-2 inline-block"
            >
              Rate your first product
            </Link>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
