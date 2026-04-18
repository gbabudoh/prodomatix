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
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/product/${product.id}`}>
        <div
          className={cn(
            "relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer group",
            "bg-[var(--bg-secondary)] border-[var(--border-primary)]",
            "hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5",
            "hover:-translate-y-0.5",
            product.isAdflowPromoted && "border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent"
          )}
        >
          {/* Promoted Badge */}
          {product.isAdflowPromoted && (
            <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg">
              <Sparkles className="w-3 h-3 text-white" />
              <span className="text-[10px] font-bold text-white uppercase">Featured</span>
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-emerald-400 text-sm px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                {product.ticker}
              </span>
              {product.hasDividendBadge && (
                <div className="p-1 bg-emerald-500/10 rounded-md" title="Trust Dividend">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              )}
              {product.status === "ipo" && (
                <span className="text-[10px] font-bold text-blue-400 px-2 py-0.5 bg-blue-500/10 rounded-md border border-blue-500/20 uppercase">
                  IPO
                </span>
              )}
            </div>
            
            {/* Mini Sparkline */}
            <div className="w-16 h-8 opacity-40 group-hover:opacity-100 transition-opacity">
              <svg width="100%" height="100%" viewBox="0 0 100 80" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke={isPositive ? "#10b981" : isNegative ? "#ef4444" : "#6b7280"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={generateSparkline()}
                />
              </svg>
            </div>
          </div>

          {/* Product Info */}
          <div className="mb-4">
            <h3 className="text-base font-semibold text-[var(--text-primary)] truncate group-hover:text-emerald-400 transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
              {product.category}
            </p>
          </div>

          {/* Score Display */}
          <div className={cn(
            "flex items-center justify-between p-3 rounded-xl border",
            getScoreBgColor(currentPrice)
          )}>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium">
                Prodo Score
              </span>
              <div className={cn("text-2xl font-bold font-mono tabular-nums", getScoreColor(currentPrice))}>
                {currentPrice.toFixed(2)}
              </div>
            </div>
            
            <div className={cn(
              "text-right",
              isPositive && "text-emerald-400",
              isNegative && "text-red-400",
              !isPositive && !isNegative && "text-[var(--text-muted)]"
            )}>
              <div className="flex items-center justify-end gap-1 text-sm font-bold font-mono">
                {isPositive && <TrendingUp className="w-4 h-4" />}
                {isNegative && <TrendingDown className="w-4 h-4" />}
                <span>{isPositive && "+"}{priceChangePercent.toFixed(1)}%</span>
              </div>
              <span className="text-xs opacity-70 font-mono">
                {isPositive && "+"}{priceChange.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border-primary)]">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Users className="w-3.5 h-3.5" />
              <span className="font-medium">{formatNumber(product.totalRatings || 0)} ratings</span>
            </div>
            
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>View Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
