"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  TrendingUp,
  TrendingDown,
  Trash2,
  Award,
  ExternalLink,
  AlertCircle,
  Plus,
  ArrowUpRight,
  Clock,
  Sparkles,
  Search,
} from "lucide-react";

interface WatchlistItem {
  id: number;
  createdAt: string;
  product: {
    id: number;
    name: string;
    ticker: string;
    currentPrice: string;
    priceChange: string;
    priceChangePercent: string;
    totalRatings: number;
    hasDividendBadge: boolean;
    category: string;
  };
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchWatchlist();
  }, []);

  async function fetchWatchlist() {
    try {
      const res = await fetch("/api/consumer/watchlist");
      if (res.ok) {
        const data = await res.json();
        setWatchlist(data.watchlist || []);
      }
    } catch (error) {
      console.error("Failed to fetch watchlist:", error);
    } finally {
      setLoading(false);
    }
  }

  async function removeFromWatchlist(productId: number) {
    setRemoving(productId);
    try {
      const res = await fetch(`/api/consumer/watchlist?productId=${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setWatchlist((prev) =>
          prev.filter((item) => item.product.id !== productId)
        );
      }
    } catch (error) {
      console.error("Failed to remove from watchlist:", error);
    } finally {
      setRemoving(null);
    }
  }

  const filteredWatchlist = watchlist.filter(
    (item) =>
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = watchlist.reduce(
    (sum, item) => sum + parseFloat(item.product.currentPrice || "0"),
    0
  );

  const avgChange =
    watchlist.length > 0
      ? watchlist.reduce(
          (sum, item) => sum + parseFloat(item.product.priceChange || "0"),
          0
        ) / watchlist.length
      : 0;

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-muted)] text-sm">Loading watchlist...</p>
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
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <Eye className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                Your Watchlist
              </h1>
              <p className="text-[var(--text-secondary)]">
                Track products you&apos;re interested in
              </p>
            </div>
          </div>
          <Link href="/consumer/discover">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer">
              <Plus className="w-4 h-4" />
              Add Products
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
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">
            {watchlist.length}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Products Watching</div>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">
            {totalValue.toFixed(2)}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Total Value</div>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              avgChange >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"
            )}>
              {avgChange >= 0 ? (
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
          </div>
          <div className={cn(
            "text-3xl font-bold mb-1",
            avgChange >= 0 ? "text-emerald-400" : "text-red-400"
          )}>
            {avgChange >= 0 && "+"}{avgChange.toFixed(2)}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Avg Change</div>
        </div>
      </motion.div>

      {/* Search */}
      {watchlist.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search your watchlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl pl-12 pr-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>
        </motion.div>
      )}

      {/* Watchlist Items */}
      {filteredWatchlist.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredWatchlist.map((item, index) => {
              const change = parseFloat(item.product.priceChange || "0");
              const isPositive = change >= 0;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.03 }}
                  layout
                >
                  <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] p-4 hover:border-emerald-500/30 transition-all group">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/product/${item.product.id}`}
                        className="flex-1 flex items-center gap-4"
                      >
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="font-mono font-bold text-emerald-400 text-sm">
                            {item.product.ticker.slice(0, 3)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-emerald-400">
                              {item.product.ticker}
                            </span>
                            {item.product.hasDividendBadge && (
                              <Award className="w-4 h-4 text-emerald-400" />
                            )}
                            <span className="px-2 py-0.5 bg-[var(--bg-tertiary)] text-[var(--text-muted)] text-xs rounded-full">
                              {item.product.category || "General"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-[var(--text-muted)] truncate">
                              {item.product.name}
                            </span>
                            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Added {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-[var(--text-primary)] text-lg">
                            {parseFloat(item.product.currentPrice).toFixed(2)}
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
                      </Link>
                      <div className="flex items-center gap-2 pl-4 border-l border-[var(--border-primary)]">
                        <Link href={`/product/${item.product.id}`}>
                          <button className="p-2.5 text-[var(--text-muted)] hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-colors cursor-pointer">
                            <ArrowUpRight className="w-5 h-5" />
                          </button>
                        </Link>
                        <button
                          onClick={() => removeFromWatchlist(item.product.id)}
                          disabled={removing === item.product.id}
                          className="p-2.5 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {removing === item.product.id ? (
                            <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : watchlist.length > 0 && searchQuery ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)]"
        >
          <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-[var(--text-primary)] font-semibold mb-2">No matches found</h3>
          <p className="text-[var(--text-muted)] text-sm mb-4">
            Try a different search term
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Clear Search
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center py-16 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)]"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Eye className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Your watchlist is empty
          </h3>
          <p className="text-[var(--text-muted)] text-sm mb-6 max-w-md mx-auto">
            Start tracking products you&apos;re interested in to monitor their performance and get notified about changes.
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
