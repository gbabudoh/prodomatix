"use client";

import { useMarketStore } from "@/store/market-store";
import { Card } from "@/components/shared/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Award, ChevronRight } from "lucide-react";
import Link from "next/link";

export function AdFlowBillboard() {
  const { products } = useMarketStore();

  // Get promoted products
  const promotedProducts = products.filter((p) => p.isAdflowPromoted);

  if (promotedProducts.length === 0) return null;

  const featured = promotedProducts[0];
  const priceChange = parseFloat(featured.priceChange || "0");
  const isPositive = priceChange >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Link href={`/product/${featured.id}`}>
        <Card className="relative overflow-hidden cursor-pointer group border-yellow-500/30 bg-gradient-to-r from-yellow-500/5 via-transparent to-blue-500/5">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-blue-500/10 opacity-50" />

          {/* Decorative chart lines */}
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            <svg
              viewBox="0 0 400 100"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0 80 Q 50 10, 100 70 T 200 30 T 300 60 T 400 20"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="2"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6">
            {/* Left: Product Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 rounded-full">
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                  <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">
                    AdFlow Featured
                  </span>
                </span>
                {featured.status === "ipo" && (
                  <span className="px-2 py-0.5 bg-blue-500/20 rounded-full text-blue-400 text-xs font-bold">
                    HOT IPO
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono font-bold text-emerald-400 text-xl">
                  {featured.ticker}
                </span>
                {featured.hasDividendBadge && (
                  <Award className="w-5 h-5 text-emerald-400" />
                )}
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                {featured.name}
              </h2>

              <p className="text-gray-400 max-w-md">
                {featured.description ||
                  "Premium product with exceptional market performance."}
              </p>
            </div>

            {/* Right: Prodo Score Display */}
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Prodo Score</div>
              <div className="text-5xl md:text-6xl font-bold font-mono text-white mb-2">
                {parseFloat(featured.currentPrice || "0").toFixed(2)}
              </div>
              <div
                className={cn(
                  "flex items-center justify-end gap-2 text-lg font-medium",
                  isPositive ? "text-emerald-400" : "text-red-400"
                )}
              >
                <TrendingUp
                  className={cn("w-5 h-5", !isPositive && "rotate-180")}
                />
                <span>
                  {isPositive && "+"}
                  {priceChange.toFixed(2)} (
                  {parseFloat(featured.priceChangePercent || "0").toFixed(1)}%)
                </span>
              </div>
              <div className="text-yellow-400 font-bold uppercase text-sm tracking-widest mt-2">
                High Yield Growth
              </div>
            </div>

            {/* CTA Arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
