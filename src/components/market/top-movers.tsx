"use client";

import { useMarketStore } from "@/store/market-store";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Award, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function TopMovers() {
  const { getTopMovers } = useMarketStore();
  const { gainers, losers } = getTopMovers();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Top Gainers */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-[var(--border-primary)] bg-emerald-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">Top Gainers</h3>
                <p className="text-xs text-[var(--text-muted)]">Best performing today</p>
              </div>
            </div>
            <span className="px-2 py-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 rounded-full uppercase">
              Bullish
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-[var(--border-primary)]">
          {gainers.map((product, index) => {
            const priceChangePercent = parseFloat(product.priceChangePercent || "0");
            const currentPrice = parseFloat(product.currentPrice || "0");

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-emerald-500/5 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[var(--text-muted)] bg-[var(--bg-tertiary)] rounded-lg">
                    {index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[var(--text-primary)] group-hover:text-emerald-400 transition-colors">
                        {product.ticker}
                      </span>
                      {product.hasDividendBadge && (
                        <Award className="w-3.5 h-3.5 text-emerald-400/60" />
                      )}
                    </div>
                    <span className="text-xs text-[var(--text-muted)] truncate max-w-[120px] block">
                      {product.name}
                    </span>
                  </div>
                </div>
                
                <div className="text-right flex items-center gap-4">
                  <div>
                    <div className="font-mono font-semibold text-[var(--text-primary)]">
                      {currentPrice.toFixed(2)}
                    </div>
                    <div className="text-sm font-bold text-emerald-400">
                      +{priceChangePercent.toFixed(1)}%
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Top Losers */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-[var(--border-primary)] bg-red-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">Top Losers</h3>
                <p className="text-xs text-[var(--text-muted)]">Declining sentiment</p>
              </div>
            </div>
            <span className="px-2 py-1 text-[10px] font-bold text-red-400 bg-red-500/10 rounded-full uppercase">
              Bearish
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-[var(--border-primary)]">
          {losers.map((product, index) => {
            const priceChangePercent = parseFloat(product.priceChangePercent || "0");
            const currentPrice = parseFloat(product.currentPrice || "0");

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-red-500/5 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[var(--text-muted)] bg-[var(--bg-tertiary)] rounded-lg">
                    {index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[var(--text-primary)] group-hover:text-red-400 transition-colors">
                        {product.ticker}
                      </span>
                      {product.hasDividendBadge && (
                        <Award className="w-3.5 h-3.5 text-emerald-400/60" />
                      )}
                    </div>
                    <span className="text-xs text-[var(--text-muted)] truncate max-w-[120px] block">
                      {product.name}
                    </span>
                  </div>
                </div>
                
                <div className="text-right flex items-center gap-4">
                  <div>
                    <div className="font-mono font-semibold text-[var(--text-primary)]">
                      {currentPrice.toFixed(2)}
                    </div>
                    <div className="text-sm font-bold text-red-400">
                      {priceChangePercent.toFixed(1)}%
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
