"use client";

import { useState, useEffect } from "react";
import { useMarketStore } from "@/store/market-store";
import { cn, formatRelativeTime, countryToFlag } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, TrendingUp, TrendingDown, Quote } from "lucide-react";

export function LiveFeed() {
  const { recentStatements } = useMarketStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <Radio className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] text-sm">Live Feed</h3>
              <p className="text-[10px] text-[var(--text-muted)]">Real-time sentiment</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">Live</span>
          </div>
        </div>
      </div>

      {/* Feed Items */}
      <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <AnimatePresence mode="popLayout">
          {recentStatements.map((statement, index) => (
            <motion.div
              key={statement.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: index * 0.05 }}
              className="px-4 py-3.5 border-b border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)]/30 transition-colors"
            >
              {/* Header Row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-400 text-xs px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                    {statement.productTicker}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)] truncate max-w-[100px]">
                    {statement.productName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base" title={statement.countryCode}>
                    {countryToFlag(statement.countryCode)}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-xs font-bold px-2 py-0.5 rounded-md",
                      statement.score >= 7
                        ? "text-emerald-400 bg-emerald-500/10"
                        : statement.score >= 5
                        ? "text-amber-400 bg-amber-500/10"
                        : "text-red-400 bg-red-500/10"
                    )}
                  >
                    {statement.score.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Statement */}
              <div className="relative pl-3 mb-2">
                <Quote className="absolute left-0 top-0 w-2.5 h-2.5 text-[var(--text-muted)] opacity-50" />
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2 italic">
                  {statement.statement}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  {mounted ? formatRelativeTime(statement.createdAt) : "..."}
                </span>
                {statement.score >= 7 ? (
                  <TrendingUp className="w-3 h-3 text-emerald-500/50" />
                ) : statement.score < 5 ? (
                  <TrendingDown className="w-3 h-3 text-red-500/50" />
                ) : null}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
