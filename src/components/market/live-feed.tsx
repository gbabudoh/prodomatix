"use client";

import { useState, useEffect } from "react";
import { useMarketStore } from "@/store/market-store";
import { cn, formatRelativeTime, countryToFlag } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, TrendingUp, TrendingDown, Quote } from "lucide-react";

export function LiveFeed() {
  const { recentStatements } = useMarketStore();

  return (
    <div className="glass rounded-2xl border border-[var(--border-primary)] overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.05)]">
      {/* Header */}
      <div className="px-4 py-4 border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]/30 backdrop-blur-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-50" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-primary)] text-sm tracking-tight">Sentiment Stream</h3>
              <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-widest">Global Live Feed</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Live</span>
          </div>
        </div>
      </div>

      {/* Feed Items */}
      <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        <AnimatePresence mode="popLayout">
          {recentStatements.map((statement, index) => (
            <motion.div
              key={statement.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
              className="px-4 py-4 border-b border-[var(--border-primary)]/50 hover:bg-emerald-500/[0.03] transition-colors relative group"
            >
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Header Row */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-emerald-400 text-[10px] px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                    {statement.productTicker}
                  </span>
                  <span className="text-[11px] font-bold text-[var(--text-secondary)] truncate max-w-[120px] tracking-tight">
                    {statement.productName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm filter saturate-150" title={statement.countryCode}>
                    {countryToFlag(statement.countryCode)}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[10px] font-black px-2 py-0.5 rounded shadow-sm",
                      statement.score >= 7
                        ? "text-emerald-400 bg-emerald-500/20 border border-emerald-500/30"
                        : statement.score >= 5
                        ? "text-amber-400 bg-amber-500/20 border border-amber-500/30"
                        : "text-red-400 bg-red-500/20 border border-red-500/30"
                    )}
                  >
                    {statement.score.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Statement */}
              <div className="relative pl-3 mb-2.5">
                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-emerald-500/20" />
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed line-clamp-2 italic font-medium opacity-90 group-hover:opacity-100 transition-opacity">
                  &quot;{statement.statement}&quot;
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-[var(--text-muted)] font-mono font-bold tracking-tighter uppercase">
                  {formatRelativeTime(statement.createdAt)}
                </span>
                <div className="flex items-center gap-1">
                  {statement.score >= 7 ? (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400/70">
                      <TrendingUp className="w-3 h-3" />
                      <span>Bullish</span>
                    </div>
                  ) : statement.score < 5 ? (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-red-400/70">
                      <TrendingDown className="w-3 h-3" />
                      <span>Bearish</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
