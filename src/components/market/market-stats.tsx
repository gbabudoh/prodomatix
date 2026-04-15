"use client";

import { useMarketStore } from "@/store/market-store";
import { Card } from "@/components/shared/card";
import { formatNumber } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  BarChart3,
  Zap,
} from "lucide-react";

export function MarketStats() {
  const { products } = useMarketStore();

  // Calculate market stats
  const totalProducts = products.length;
  const totalRatings = products.reduce(
    (sum, p) => sum + (p.totalRatings || 0),
    0
  );
  const avgScore =
    products.reduce((sum, p) => sum + parseFloat(p.currentPrice || "0"), 0) /
    totalProducts;
  const gainers = products.filter(
    (p) => parseFloat(p.priceChange || "0") > 0
  ).length;
  const losers = products.filter(
    (p) => parseFloat(p.priceChange || "0") < 0
  ).length;
  const marketSentiment = gainers > losers ? "Bullish" : gainers < losers ? "Bearish" : "Neutral";

  const stats = [
    {
      label: "Avg Prodo Score",
      value: avgScore.toFixed(2),
      icon: Activity,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Total Products",
      value: formatNumber(totalProducts),
      icon: BarChart3,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Total Prodo Ratings",
      value: formatNumber(totalRatings),
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Market Sentiment",
      value: marketSentiment,
      icon: marketSentiment === "Bullish" ? TrendingUp : marketSentiment === "Bearish" ? TrendingDown : Zap,
      color:
        marketSentiment === "Bullish"
          ? "text-emerald-400"
          : marketSentiment === "Bearish"
          ? "text-red-400"
          : "text-yellow-400",
      bgColor:
        marketSentiment === "Bullish"
          ? "bg-emerald-500/10"
          : marketSentiment === "Bearish"
          ? "bg-red-500/10"
          : "bg-yellow-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div
                className={`absolute top-0 right-0 w-20 h-20 ${stat.bgColor} rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} mt-1`}>
                  {stat.value}
                </p>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
