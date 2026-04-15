"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/shared/card";
import { Button } from "@/components/shared/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Eye,
  TrendingUp,
  TrendingDown,
  Trash2,
  Award,
  ExternalLink,
  AlertCircle,
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

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Eye className="w-8 h-8 text-blue-400" />
          Your Watchlist
        </h1>
        <p className="text-gray-400">
          Track products you&apos;re interested in
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white">
              {watchlist.length}
            </div>
            <div className="text-sm text-gray-500">Products Watching</div>
          </div>
          <Link href="/consumer/discover">
            <Button variant="secondary" size="sm">
              Add More
            </Button>
          </Link>
        </Card>
      </motion.div>

      {/* Watchlist Items */}
      {watchlist.length > 0 ? (
        <div className="space-y-3">
          {watchlist.map((item, index) => {
            const change = parseFloat(item.product.priceChange || "0");
            const isPositive = change > 0;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="flex items-center justify-between">
                  <Link
                    href={`/product/${item.product.id}`}
                    className="flex-1 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
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
                      </div>
                      <div className="text-sm text-gray-400 truncate">
                        {item.product.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-white">
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
                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/product/${item.product.id}`}>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromWatchlist(item.product.id)}
                      disabled={removing === item.product.id}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      {removing === item.product.id ? (
                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">
              Your watchlist is empty
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Start tracking products you&apos;re interested in
            </p>
            <Link href="/consumer/discover">
              <Button>Discover Products</Button>
            </Link>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
