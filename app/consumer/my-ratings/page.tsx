"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/shared/card";
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
          <BarChart3 className="w-8 h-8 text-purple-400" />
          My Ratings
        </h1>
        <p className="text-gray-400">Your rating history and impact</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-6"
      >
        <Card className="text-center py-4">
          <div className="text-2xl font-bold text-purple-400">{stats.total}</div>
          <div className="text-xs text-gray-500 mt-1">Total Ratings</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-2xl font-bold text-emerald-400">
            {stats.avgScore.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Avg Score</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-2xl font-bold text-blue-400">{stats.thisMonth}</div>
          <div className="text-xs text-gray-500 mt-1">This Month</div>
        </Card>
      </motion.div>

      {/* Ratings List */}
      {ratings.length > 0 ? (
        <div className="space-y-4">
          {ratings.map((rating, index) => {
            const priceChange = parseFloat(rating.productPriceChange || "0");
            const isPositive = priceChange > 0;
            return (
              <motion.div
                key={rating.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <div className="flex items-start justify-between mb-3">
                    <Link
                      href={`/product/${rating.productId}`}
                      className="flex items-center gap-3"
                    >
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <span className="font-mono font-bold text-emerald-400 text-xs">
                          {rating.productTicker.slice(0, 3)}
                        </span>
                      </div>
                      <div>
                        <div className="font-mono font-bold text-emerald-400">
                          {rating.productTicker}
                        </div>
                        <div className="text-sm text-gray-400">
                          {rating.productName}
                        </div>
                      </div>
                    </Link>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="font-bold text-white text-lg">
                          {parseFloat(rating.weightedScore).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Statement */}
                  <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                      <p className="text-gray-300 text-sm italic">
                        &quot;{rating.tenWordStatement}&quot;
                      </p>
                    </div>
                  </div>

                  {/* Indicators */}
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {[
                      { label: "SAT", value: rating.satisfaction },
                      { label: "QUA", value: rating.quality },
                      { label: "FEL", value: rating.feel },
                      { label: "TRD", value: rating.trendy },
                      { label: "SPC", value: rating.speculation },
                    ].map((indicator) => (
                      <div
                        key={indicator.label}
                        className="bg-gray-800/30 rounded py-1.5"
                      >
                        <div className="text-xs text-gray-500">
                          {indicator.label}
                        </div>
                        <div
                          className={cn(
                            "font-bold text-sm",
                            indicator.value >= 7
                              ? "text-emerald-400"
                              : indicator.value >= 4
                              ? "text-yellow-400"
                              : "text-red-400"
                          )}
                        >
                          {indicator.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Current Price */}
                  <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between text-sm">
                    <span className="text-gray-500">Current Price</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">
                        {parseFloat(rating.productCurrentPrice).toFixed(2)}
                      </span>
                      <span
                        className={cn(
                          "flex items-center gap-1",
                          isPositive ? "text-emerald-400" : "text-red-400"
                        )}
                      >
                        {isPositive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {isPositive && "+"}
                        {priceChange.toFixed(2)}
                      </span>
                    </div>
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
            <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">No ratings yet</h3>
            <p className="text-gray-500 text-sm mb-4">
              Start rating products to see your history here
            </p>
            <Link href="/consumer/discover">
              <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                Discover Products
              </button>
            </Link>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
