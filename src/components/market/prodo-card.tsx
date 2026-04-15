"use client";

import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";
import type { Product } from "@/db/schema";
import { Card } from "@/components/shared/card";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Award,
  Sparkles,
  ChevronRight,
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

  // Score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-400";
    if (score >= 6) return "text-yellow-400";
    if (score >= 4) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return "from-emerald-500/20 to-emerald-500/5";
    if (score >= 6) return "from-yellow-500/20 to-yellow-500/5";
    if (score >= 4) return "from-orange-500/20 to-orange-500/5";
    return "from-red-500/20 to-red-500/5";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/product/${product.id}`}>
        <Card
          hover
          className={cn(
            "relative overflow-hidden cursor-pointer group",
            product.isAdflowPromoted &&
              "ring-1 ring-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-transparent"
          )}
        >
          {/* Promoted badge */}
          {product.isAdflowPromoted && (
            <div className="absolute top-0 right-0 px-2 py-1 bg-yellow-500/20 rounded-bl-lg">
              <div className="flex items-center gap-1 text-yellow-400 text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                HOT
              </div>
            </div>
          )}

          {/* IPO badge */}
          {product.status === "ipo" && (
            <div className="absolute top-0 left-0 px-2 py-1 bg-blue-500/20 rounded-br-lg">
              <span className="text-blue-400 text-xs font-bold">IPO</span>
            </div>
          )}

          <div className="flex items-start justify-between gap-4">
            {/* Left: Product info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {product.ticker}
                </span>
                {product.hasDividendBadge && (
                  <Award className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <h3 className="font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {product.category}
              </p>
            </div>

            {/* Right: Prodo Score display */}
            <div
              className={cn(
                "flex flex-col items-end p-3 rounded-lg bg-gradient-to-br",
                getScoreBg(currentPrice)
              )}
            >
              <span className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                Prodo Score
              </span>
              <span
                className={cn(
                  "text-2xl font-bold font-mono",
                  getScoreColor(currentPrice)
                )}
              >
                {currentPrice.toFixed(2)}
              </span>
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  isPositive && "text-emerald-400",
                  isNegative && "text-red-400",
                  !isPositive && !isNegative && "text-gray-500"
                )}
              >
                {isPositive && <TrendingUp className="w-3 h-3" />}
                {isNegative && <TrendingDown className="w-3 h-3" />}
                {!isPositive && !isNegative && <Minus className="w-3 h-3" />}
                <span>
                  {isPositive && "+"}
                  {priceChange.toFixed(2)} ({priceChangePercent.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Bottom stats */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Users className="w-4 h-4" />
              <span>{formatNumber(product.totalRatings || 0)} ratings</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-sm group-hover:text-emerald-400 transition-colors">
              <span>Rate now</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
