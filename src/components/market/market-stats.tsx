"use client";

import { useMarketStore } from "@/store/market-store";
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
      color: "emerald",
      trend: "+2.4%",
      trendUp: true,
    },
    {
      label: "Total Products",
      value: formatNumber(totalProducts),
      icon: BarChart3,
      color: "blue",
      trend: "+12",
      trendUp: true,
    },
    {
      label: "Total Ratings",
      value: formatNumber(totalRatings),
      icon: Users,
      color: "violet",
      trend: "+1.2K",
      trendUp: true,
    },
    {
      label: "Market Sentiment",
      value: marketSentiment,
      icon: marketSentiment === "Bullish" ? TrendingUp : marketSentiment === "Bearish" ? TrendingDown : Zap,
      color: marketSentiment === "Bullish" ? "emerald" : marketSentiment === "Bearish" ? "red" : "amber",
      isLive: true,
    },
  ];

  const colorMap = {
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      glow: "shadow-emerald-500/10",
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400",
      glow: "shadow-blue-500/10",
    },
    violet: {
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      text: "text-violet-400",
      glow: "shadow-violet-500/10",
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-400",
      glow: "shadow-amber-500/10",
    },
    red: {
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      text: "text-red-400",
      glow: "shadow-red-500/10",
    },
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colors = colorMap[stat.color as keyof typeof colorMap];
        
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className={`
              relative p-5 rounded-2xl border overflow-hidden
              bg-[var(--bg-secondary)] border-[var(--border-primary)]
              hover:border-[var(--border-secondary)] transition-all duration-300
              hover:shadow-lg ${colors.glow}
            `}
          >
            {/* Background Gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${colors.bg} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50`} />
            
            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${colors.bg} border ${colors.border}`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                
                {stat.isLive ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--bg-tertiary)] rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.bg} opacity-75`} />
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${colors.text.replace('text-', 'bg-')}`} />
                    </span>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Live</span>
                  </div>
                ) : stat.trend && (
                  <div className={`flex items-center gap-0.5 text-xs font-medium ${stat.trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.trend}
                  </div>
                )}
              </div>
              
              {/* Value */}
              <div className={`text-3xl font-bold font-mono tabular-nums ${colors.text} mb-1`}>
                {stat.value}
              </div>
              
              {/* Label */}
              <p className="text-sm text-[var(--text-muted)] font-medium">
                {stat.label}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
