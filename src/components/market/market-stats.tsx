"use client";

import { useMarketStore } from "@/store/market-store";
import { formatNumber, cn } from "@/lib/utils";
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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ delay: index * 0.1, duration: 0.4, type: "spring", stiffness: 100 }}
            className={cn(
              "relative p-5 rounded-2xl border overflow-hidden transition-all duration-500",
              "glass border-[var(--border-primary)]",
              `hover:border-${stat.color}-500/50 hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.1)]`
            )}
          >
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${colors.bg} rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-30 group-hover:opacity-60 transition-opacity`} />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className={`p-3 rounded-xl ${colors.bg} border ${colors.border} shadow-[0_0_15px_rgba(0,0,0,0.1)]`}>
                  <Icon className={`w-5 h-5 ${colors.text} animate-float`} />
                </div>
                
                {stat.isLive ? (
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.bg} opacity-75`} />
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${stat.color === 'emerald' ? 'bg-emerald-500' : stat.color === 'red' ? 'bg-red-500' : 'bg-amber-500'}`} />
                    </span>
                    <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Live</span>
                  </div>
                ) : stat.trend && (
                  <div className={cn(
                    "flex items-center gap-1 text-[11px] font-black font-mono px-2 py-0.5 rounded border",
                    stat.trendUp ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'
                  )}>
                    {stat.trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {stat.trend}
                  </div>
                )}
              </div>
              
              {/* Value */}
              <div className={`text-4xl font-extrabold font-mono tabular-nums tracking-tighter ${colors.text} mb-2 drop-shadow-sm`}>
                {stat.value}
              </div>
              
              {/* Label */}
              <p className="text-[11px] text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] opacity-80">
                {stat.label}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
