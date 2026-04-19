"use client";

import { useMarketStore } from "@/store/market-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Sparkles, Award } from "lucide-react";

export function TickerTape() {
  const { tickerItems } = useMarketStore();

  // Duplicate items for seamless loop
  const items = [...tickerItems, ...tickerItems];

  return (
    <div className="relative overflow-hidden bg-[var(--bg-secondary)]/40 backdrop-blur-3xl border-b border-[var(--border-primary)] shadow-[0_4px_30px_rgba(0,0,0,0.2)] isolation-auto">
      {/* Gradient overlays with glass effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-secondary)]/50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--bg-secondary)] via-[var(--bg-secondary)]/50 to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex py-3.5"
        animate={{ x: [0, -50 * tickerItems.length] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: tickerItems.length * 4,
            ease: "linear",
          },
        }}
      >
        {items.map((product, index) => {
          const priceChange = parseFloat(product.priceChange || "0");
          const currentPrice = parseFloat(product.currentPrice || "0");
          const isPositive = priceChange > 0;
          const isNegative = priceChange < 0;

          return (
            <div
              key={`${product.id}-${index}`}
              className="flex items-center gap-3 px-5 border-r border-[var(--border-primary)] whitespace-nowrap"
            >
              {/* Promoted indicator */}
              {product.isAdflowPromoted && (
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              )}

              {/* Ticker */}
              <span className="font-mono font-bold text-[var(--text-primary)] text-sm">
                {product.ticker}
              </span>

              {/* Dividend badge */}
              {product.hasDividendBadge && (
                <Award className="w-3.5 h-3.5 text-emerald-400/60" />
              )}

              {/* Price */}
              <span className="font-mono text-[var(--text-secondary)] text-sm">
                {currentPrice.toFixed(2)}
              </span>

              {/* Change */}
              <span
                className={cn(
                  "flex items-center gap-1 font-mono text-sm font-medium px-2 py-0.5 rounded-md",
                  isPositive && "text-emerald-400 bg-emerald-500/10",
                  isNegative && "text-red-400 bg-red-500/10",
                  !isPositive && !isNegative && "text-[var(--text-muted)] bg-[var(--bg-tertiary)]"
                )}
              >
                {isPositive && <TrendingUp className="w-3 h-3" />}
                {isNegative && <TrendingDown className="w-3 h-3" />}
                {!isPositive && !isNegative && <Minus className="w-3 h-3" />}
                {isPositive && "+"}
                {priceChange.toFixed(2)}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
