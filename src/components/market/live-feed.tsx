"use client";

import { useMarketStore } from "@/store/market-store";
import { Card, CardHeader, CardTitle } from "@/components/shared/card";
import { formatRelativeTime, countryToFlag } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, TrendingUp, TrendingDown } from "lucide-react";

export function LiveFeed() {
  const { recentStatements } = useMarketStore();

  return (
    <Card variant="glass" className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-400" />
          Live Prodo Feed
        </CardTitle>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </CardHeader>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <AnimatePresence mode="popLayout">
          {recentStatements.map((statement, index) => (
            <motion.div
              key={statement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {statement.productTicker}
                  </span>
                  <span className="text-gray-500 text-sm">·</span>
                  <span className="text-gray-400 text-sm truncate max-w-[120px]">
                    {statement.productName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">
                    {countryToFlag(statement.countryCode)}
                  </span>
                  <span
                    className={`flex items-center gap-0.5 text-sm font-bold ${
                      statement.score >= 7
                        ? "text-emerald-400"
                        : statement.score >= 5
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {statement.score >= 7 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : statement.score < 5 ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : null}
                    {statement.score}
                  </span>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                &ldquo;{statement.statement}&rdquo;
              </p>
              <p className="text-gray-600 text-xs mt-2">
                {formatRelativeTime(statement.createdAt)}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}
