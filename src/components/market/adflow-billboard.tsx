"use client";

import { useMarketStore } from "@/store/market-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Award, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export function AdFlowBillboard() {
  const { products } = useMarketStore();

  const promotedProducts = products.filter((p) => p.isAdflowPromoted);

  if (promotedProducts.length === 0) return null;

  const featured = promotedProducts[0];
  const priceChange = parseFloat(featured.priceChange || "0");
  const priceChangePercent = parseFloat(featured.priceChangePercent || "0");
  const currentPrice = parseFloat(featured.currentPrice || "0");
  const isPositive = priceChange >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/product/${featured.id}`}>
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-[var(--bg-secondary)] to-orange-500/10 cursor-pointer group">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="adflow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#f97316" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <path
                d="M0 150 Q 100 50, 200 100 T 400 80"
                fill="none"
                stroke="url(#adflow-gradient)"
                strokeWidth="2"
              />
              <path
                d="M0 180 Q 150 100, 250 140 T 400 100"
                fill="none"
                stroke="url(#adflow-gradient)"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* Glow Effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Left Content */}
              <div className="flex-1">
                {/* Badge Row */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg shadow-amber-500/30">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs font-bold text-white uppercase tracking-wide">AdFlow Featured</span>
                  </div>
                  {featured.status === "ipo" && (
                    <span className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-xs font-bold uppercase">
                      Hot IPS
                    </span>
                  )}
                  {featured.hasDividendBadge && (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400">Trust Dividend</span>
                    </div>
                  )}
                </div>

                {/* Ticker */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono font-bold text-emerald-400 text-2xl">
                    {featured.ticker}
                  </span>
                </div>

                {/* Name */}
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-amber-400 transition-colors">
                  {featured.name}
                </h2>

                {/* Description */}
                <p className="text-[var(--text-secondary)] max-w-lg mb-4 line-clamp-2">
                  {featured.description || "Premium product with exceptional market performance and strong community sentiment."}
                </p>

                {/* CTA */}
                <div className="inline-flex items-center gap-2 text-amber-400 font-medium group-hover:gap-3 transition-all">
                  <Zap className="w-4 h-4" />
                  <span>View Product Details</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Right Content - Score Display */}
              <div className="flex-shrink-0 p-6 bg-[var(--bg-primary)]/50 rounded-2xl border border-[var(--border-primary)] backdrop-blur-sm">
                <div className="text-center">
                  <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium">Prodo Score</span>
                  <div className="text-5xl md:text-6xl font-bold font-mono text-[var(--text-primary)] my-2 tabular-nums">
                    {currentPrice.toFixed(2)}
                  </div>
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold",
                      isPositive 
                        ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" 
                        : "text-red-400 bg-red-500/10 border border-red-500/20"
                    )}
                  >
                    <TrendingUp className={cn("w-4 h-4", !isPositive && "rotate-180")} />
                    <span>
                      {isPositive && "+"}
                      {priceChange.toFixed(2)} ({priceChangePercent.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-amber-400 font-bold uppercase tracking-widest">
                    High Momentum
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
