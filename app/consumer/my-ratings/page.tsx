"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  BarChart3,
  Star,
  Clock,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Award,
  Calendar,
  Target,
  Sparkles,
  ArrowUpRight,
  Filter,
} from "lucide-react";

interface Rating {
  id: number;
  productId: number;
  productName: string;
  productTicker: string;
  productCurrentPrice: string;
  productPriceChange: string;
  tenWordStatement: string;
  satisfaction: number;
  quality: number;
  feel: number;
  trendy: number;
  speculation: number;
  weightedScore: string;
  createdAt: string;
}

export default function MyRatingsPage() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    avgScore: 0,
    thisMonth: 0,
  });
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest">("newest");

  useEffect(() => {
    async function fetchRatings() {
      try {
        const res = await fetch("/api/consumer/ratings");
        if (res.ok) {
          const data = await res.json();
          setRatings(data.ratings || []);
          setStats({
            total: data.total || 0,
            avgScore: data.avgScore || 0,
            thisMonth: data.thisMonth || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch ratings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRatings();
  }, []);

  const sortedRatings = [...ratings].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "highest") {
      return parseFloat(b.weightedScore) - parseFloat(a.weightedScore);
    } else {
      return parseFloat(a.weightedScore) - parseFloat(b.weightedScore);
    }
  });

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-muted)] text-sm">Loading ratings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 pb-28 md:pb-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                My Ratings
              </h1>
              <p className="text-[var(--text-secondary)]">
                Your rating history and impact
              </p>
            </div>
          </div>
          <Link href="/consumer/discover">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer">
              <Star className="w-4 h-4" />
              Rate Products
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] p-5 hover:border-purple-500/30 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">
              All Time
            </span>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">
            {stats.total}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Total Ratings</div>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] p-5 hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
              Average
            </span>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">
            {stats.avgScore.toFixed(1)}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Avg Score</div>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] p-5 hover:border-blue-500/30 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
              This Month
            </span>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">
            {stats.thisMonth}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Ratings</div>
        </div>
      </motion.div>

      {/* Sort Options */}
      {ratings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 mb-6"
        >
          <Filter className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="text-sm text-[var(--text-muted)]">Sort by:</span>
          <div className="flex gap-2">
            {[
              { value: "newest", label: "Newest" },
              { value: "highest", label: "Highest Score" },
              { value: "lowest", label: "Lowest Score" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as typeof sortBy)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                  sortBy === option.value
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Ratings List */}
      {sortedRatings.length > 0 ? (
        <div className="space-y-4">
          {sortedRatings.map((rating, index) => {
            const priceChange = parseFloat(rating.productPriceChange || "0");
            const isPositive = priceChange >= 0;
            const score = parseFloat(rating.weightedScore);
            
            return (
              <motion.div
                key={rating.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] overflow-hidden hover:border-purple-500/30 transition-all">
                  {/* Header */}
                  <div className="p-5 border-b border-[var(--border-primary)]">
                    <div className="flex items-start justify-between">
                      <Link
                        href={`/product/${rating.productId}`}
                        className="flex items-center gap-4 group"
                      >
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                          <span className="font-mono font-bold text-emerald-400 text-sm">
                            {rating.productTicker.slice(0, 3)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-emerald-400">
                              {rating.productTicker}
                            </span>
                            <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-emerald-400 transition-colors" />
                          </div>
                          <span className="text-sm text-[var(--text-muted)]">
                            {rating.productName}
                          </span>
                        </div>
                      </Link>
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Star className={cn(
                            "w-5 h-5",
                            score >= 7 ? "text-emerald-400" : score >= 4 ? "text-yellow-400" : "text-red-400"
                          )} />
                          <span className="text-2xl font-bold text-[var(--text-primary)]">
                            {score.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" />
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Statement */}
                  <div className="px-5 py-4 bg-[var(--bg-tertiary)]/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-purple-400" />
                      </div>
                      <p className="text-[var(--text-secondary)] italic">
                        &quot;{rating.tenWordStatement}&quot;
                      </p>
                    </div>
                  </div>

                  {/* Indicators */}
                  <div className="p-5">
                    <div className="grid grid-cols-5 gap-3">
                      {[
                        { label: "Satisfaction", short: "SAT", value: rating.satisfaction },
                        { label: "Quality", short: "QUA", value: rating.quality },
                        { label: "Feel", short: "FEL", value: rating.feel },
                        { label: "Trendy", short: "TRD", value: rating.trendy },
                        { label: "Speculation", short: "SPC", value: rating.speculation },
                      ].map((indicator) => (
                        <div
                          key={indicator.short}
                          className="bg-[var(--bg-tertiary)] rounded-xl p-3 text-center"
                        >
                          <div className="text-xs text-[var(--text-muted)] mb-1 hidden sm:block">
                            {indicator.label}
                          </div>
                          <div className="text-xs text-[var(--text-muted)] mb-1 sm:hidden">
                            {indicator.short}
                          </div>
                          <div
                            className={cn(
                              "text-lg font-bold",
                              indicator.value >= 7
                                ? "text-emerald-400"
                                : indicator.value >= 4
                                ? "text-yellow-400"
                                : "text-red-400"
                            )}
                          >
                            {indicator.value}
                          </div>
                          {/* Progress bar */}
                          <div className="mt-2 h-1 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                indicator.value >= 7
                                  ? "bg-emerald-400"
                                  : indicator.value >= 4
                                  ? "bg-yellow-400"
                                  : "bg-red-400"
                              )}
                              style={{ width: `${indicator.value * 10}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Current Price */}
                    <div className="mt-4 pt-4 border-t border-[var(--border-primary)] flex items-center justify-between">
                      <span className="text-sm text-[var(--text-muted)]">Current Price</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-[var(--text-primary)]">
                          {parseFloat(rating.productCurrentPrice).toFixed(2)}
                        </span>
                        <span
                          className={cn(
                            "flex items-center gap-1 text-sm px-2 py-1 rounded-lg",
                            isPositive ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"
                          )}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {isPositive && "+"}
                          {priceChange.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center py-16 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)]"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500/10 to-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Star className="w-10 h-10 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            No ratings yet
          </h3>
          <p className="text-[var(--text-muted)] text-sm mb-6 max-w-md mx-auto">
            Start rating products to build your history and see your impact on the market.
          </p>
          <Link href="/consumer/discovery">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer">
              <Sparkles className="w-4 h-4" />
              Discover Products
            </button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
