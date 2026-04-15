"use client";

import { useMarketStore } from "@/store/market-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";

export function TickerTape() {
  const { tickerItems } = useMarketStore();

  // Duplicate items for seamless loop
  const items = [...tickerItems, ...tickerItems];

  return (
    <div className="relative overflow-hidden bg-gray-950 border-b border-gray-800">
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-950 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-950 to-transparent z-10" />

      <motion.div
        className="flex py-2"
        animate={{ x: [0, -50 * tickerItems.length] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: tickerItems.length * 3,
            ease: "linear",
          },
        }}
      >
        {items.map((product, index) => {
          const priceChange = parseFloat(product.priceChange || "0");
          const isPositive = priceChange > 0;
          const isNegative = priceChange < 0;

          return (
            <div
              key={`${product.id}-${index}`}
              className="flex items-center gap-2 px-4 border-r border-gray-800 whitespace-nowrap"
            >
              {/* Promoted badge */}
              {product.isAdflowPromoted && (
                <Sparkles className="w-3 h-3 text-yellow-400" />
              )}

              {/* Ticker symbol */}
              <span className="font-mono font-bold text-white">
                {product.ticker}
              </span>

              {/* Price */}
              <span className="font-mono text-gray-300">
                {parseFloat(product.currentPrice || "0").toFixed(2)}
              </span>

              {/* Change indicator */}
              <span
                className={cn(
                  "flex items-center gap-0.5 font-mono text-sm",
                  isPositive && "text-emerald-400",
                  isNegative && "text-red-400",
                  !isPositive && !isNegative && "text-gray-500"
                )}
              >
                {isPositive && <TrendingUp className="w-3 h-3" />}
                {isNegative && <TrendingDown className="w-3 h-3" />}
                {!isPositive && !isNegative && <Minus className="w-3 h-3" />}
                {isPositive && "+"}
                {priceChange.toFixed(2)}
              </span>

              {/* Dividend badge */}
              {product.hasDividendBadge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded">
                  DIV
                </span>
              )}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
