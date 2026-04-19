"use client";

import { cn, formatNumber } from "@/lib/utils";
import type { Product } from "@/db/schema";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

import { trackAction } from "@/lib/tracking-client";

interface ProdoCardProps {
  product: Product;
  index?: number;
}

export function ProdoCard({ product, index = 0 }: ProdoCardProps) {
  const priceChange = parseFloat(product.priceChange || "0");
  const priceChangePercent = parseFloat(product.priceChangePercent || "0");
  const currentPrice = parseFloat(product.currentPrice || "0");
  const isPositive = priceChange > 0;
  const isNegative = priceChange < 0;

  const handleTrackClick = () => {
    trackAction(product.id, 'click');
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-400";
    if (score >= 6) return "text-amber-400";
    if (score >= 4) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return "bg-emerald-500/10 border-emerald-500/20";
    if (score >= 6) return "bg-amber-500/10 border-amber-500/20";
    if (score >= 4) return "bg-orange-500/10 border-orange-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  // Generate sparkline points
  const generateSparkline = () => {
    const basePoints = [45, 42, 48, 40, 52, 45, 50];
    if (isPositive) basePoints[basePoints.length - 1] = 30;
    if (isNegative) basePoints[basePoints.length - 1] = 65;
    return basePoints.map((p, i) => `${i * 16},${p}`).join(" ");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -5,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="perspective-1000"
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/product/${product.id}`} onClick={handleTrackClick}>
        <div
          className={cn(
            "relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer group isolation-auto",
            "bg-[var(--bg-secondary)]/80 backdrop-blur-md border-[var(--border-primary)]",
            "hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]",
            "scanline-container",
            product.isAdflowPromoted && "scanline-active border-amber-500/40 bg-gradient-to-br from-amber-500/5 to-transparent neon-border-blue"
          )}
        >
          {/* Subtle Glow Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

          {/* Promoted Badge */}
          {product.isAdflowPromoted && (
            <div className="absolute -top-2 -right-2 z-30 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-float">
              <Sparkles className="w-3 h-3 text-white" />
              <span className="text-[10px] font-extrabold text-white uppercase tracking-wider">Featured</span>
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between mb-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-emerald-400 text-sm px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20 group-hover:border-emerald-400/40 transition-colors">
                {product.ticker}
              </span>
              {product.hasDividendBadge && (
                <div className="p-1 bg-emerald-500/10 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.1)]" title="Trust Dividend">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              )}
              {product.status === "ipo" && (
                <span className="text-[10px] font-bold text-blue-400 px-2 py-0.5 bg-blue-500/10 rounded-md border border-blue-500/20 uppercase tracking-tighter">
                  IPO
                </span>
              )}
            </div>
            
            {/* Mini Sparkline */}
            <div className="w-16 h-8 opacity-40 group-hover:opacity-100 transition-opacity relative">
              <div className="absolute inset-0 bg-emerald-400/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              <svg width="100%" height="100%" viewBox="0 0 100 80" preserveAspectRatio="none" className="relative z-10">
                <polyline
                  fill="none"
                  stroke={isPositive ? "#34d399" : isNegative ? "#ef4444" : "#6b7280"}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={generateSparkline()}
                  className="filter drop-shadow-[0_0_4px_rgba(16,185,129,0.5)]"
                />
              </svg>
            </div>
          </div>

          {/* Product Info */}
          <div className="mb-4 relative z-10">
            <h3 className="text-base font-bold text-[var(--text-primary)] truncate group-hover:text-emerald-400 transition-colors tracking-tight">
              {product.name}
            </h3>
            <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-widest mt-0.5">
              {product.category}
            </p>
          </div>

          {/* Score Display */}
          <div className={cn(
            "flex items-center justify-between p-3 rounded-xl border relative z-10 transition-all duration-500 overflow-hidden",
            getScoreBgColor(currentPrice),
            "group-hover:border-opacity-50"
          )}>
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">
                Prodo Score
              </span>
              <div className={cn("text-3xl font-extrabold font-mono tabular-nums tracking-tighter", getScoreColor(currentPrice))}>
                {currentPrice.toFixed(2)}
              </div>
            </div>
            
            <div className={cn(
              "text-right",
              isPositive && "text-emerald-400",
              isNegative && "text-red-400",
              !isPositive && !isNegative && "text-[var(--text-muted)]"
            )}>
              <div className="flex items-center justify-end gap-1 text-sm font-black font-mono">
                {isPositive && <TrendingUp className="w-4 h-4" />}
                {isNegative && <TrendingDown className="w-4 h-4" />}
                <span className="text-lg">{isPositive && "+"}{priceChangePercent.toFixed(1)}%</span>
              </div>
              <span className="text-xs opacity-80 font-mono font-bold">
                {isPositive && "+"}{priceChange.toFixed(2)} pts
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border-primary)] relative z-10">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-medium">
              <Users className="w-3.5 h-3.5 text-emerald-500/60" />
              <span>{formatNumber(product.totalRatings || 0)} <span className="text-[10px] opacity-60 uppercase">Scouts</span></span>
            </div>
            
            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 tracking-widest uppercase">
              <span>Enter Trade</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
