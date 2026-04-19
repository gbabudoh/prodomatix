"use client";

import { useState } from "react";
import { countryData, mockProducts } from "@/lib/mock-data";
import { countryToFlag, formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Globe, TrendingUp, TrendingDown, Users, Filter, BarChart3, MapPin } from "lucide-react";

export default function GlobalHeatMapPage() {
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const countries = Object.values(countryData);

  const sortedCountries = [...countries].sort(
    (a, b) => (b.avgScore || 0) - (a.avgScore || 0)
  );

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return "bg-emerald-500";
    if (score >= 8) return "bg-emerald-400";
    if (score >= 7.5) return "bg-teal-400";
    if (score >= 7) return "bg-amber-400";
    if (score >= 6.5) return "bg-orange-400";
    return "bg-red-400";
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 8) return "text-emerald-400";
    if (score >= 7) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBorderColor = (score: number) => {
    if (score >= 8) return "border-emerald-500/20";
    if (score >= 7) return "border-amber-500/20";
    return "border-red-500/20";
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-1 flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <Globe className="w-6 h-6 md:w-7 md:h-7 text-blue-400" />
            </div>
            Global Analytics
          </h1>
          <p className="text-[var(--text-muted)]">
            See how your products and services perform across different regions.
          </p>
        </div>

        {/* Product Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--text-muted)]" />
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 light-border"
          >
            <option value="all">All Products</option>
            {mockProducts.map((product) => (
              <option key={product.id} value={product.ticker}>
                {product.ticker} - {product.name}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* World Map Visualization (Simplified Grid) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] overflow-hidden light-border">
          <div className="p-4 md:p-5 border-b border-[var(--border-primary)]">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Regional Performance</h2>
            </div>
            <p className="text-sm text-[var(--text-muted)] mt-1">Click on a region to see detailed analytics</p>
          </div>
          <div className="p-4 md:p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {sortedCountries.map((country, index) => (
                <motion.div
                  key={country.code}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="relative group"
                >
                  <div
                    className={cn(
                      "p-4 rounded-xl border transition-all cursor-pointer hover:scale-[1.02]",
                      "bg-[var(--bg-tertiary)] hover:bg-[var(--bg-primary)]",
                      getScoreBorderColor(country.avgScore || 0)
                    )}
                  >
                    {/* Country flag and name */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">
                        {countryToFlag(country.code)}
                      </span>
                      <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {country.name}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] text-[var(--text-muted)] mb-0.5 uppercase tracking-wider">Score</p>
                        <p
                          className={cn(
                            "text-2xl font-bold font-mono",
                            getScoreTextColor(country.avgScore || 0)
                          )}
                        >
                          {(country.avgScore || 0).toFixed(1)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-[var(--text-muted)] mb-0.5 uppercase tracking-wider">Ratings</p>
                        <p className="text-sm text-[var(--text-secondary)] font-medium">
                          {formatNumber(country.totalRatings || 0)}
                        </p>
                      </div>
                    </div>

                    {/* Score bar */}
                    <div className="mt-3 h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          getScoreColor(country.avgScore || 0)
                        )}
                        style={{
                          width: `${((country.avgScore || 0) / 10) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Country Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Top Performing */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="rounded-2xl border border-emerald-500/20 bg-[var(--bg-secondary)] overflow-hidden light-border">
            <div className="p-4 md:p-5 border-b border-[var(--border-primary)] bg-emerald-500/5">
              <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Top Performing Regions
              </h3>
            </div>
            <div className="p-4 md:p-5">
              <div className="space-y-3">
                {sortedCountries.slice(0, 5).map((country, index) => (
                  <div
                    key={country.code}
                    className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-primary)] light-border"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[var(--text-muted)] font-mono text-sm w-5 text-center">
                        {index + 1}
                      </span>
                      <span className="text-xl">
                        {countryToFlag(country.code)}
                      </span>
                      <span className="text-[var(--text-primary)] font-medium">
                        {country.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-[var(--text-muted)] hidden sm:flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {formatNumber(country.totalRatings || 0)}
                      </span>
                      <span
                        className={cn(
                          "font-mono font-bold text-lg",
                          getScoreTextColor(country.avgScore || 0)
                        )}
                      >
                        {(country.avgScore || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Needs Attention */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="rounded-2xl border border-orange-500/20 bg-[var(--bg-secondary)] overflow-hidden light-border">
            <div className="p-4 md:p-5 border-b border-[var(--border-primary)] bg-orange-500/5">
              <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-orange-400" />
                Regions Needing Attention
              </h3>
            </div>
            <div className="p-4 md:p-5">
              <div className="space-y-3">
                {sortedCountries.slice(-5).reverse().map((country, index) => (
                  <div
                    key={country.code}
                    className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-primary)] light-border"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[var(--text-muted)] font-mono text-sm w-5 text-center">
                        {sortedCountries.length - 4 + index}
                      </span>
                      <span className="text-xl">
                        {countryToFlag(country.code)}
                      </span>
                      <span className="text-[var(--text-primary)] font-medium">
                        {country.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-[var(--text-muted)] hidden sm:flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {formatNumber(country.totalRatings || 0)}
                      </span>
                      <span
                        className={cn(
                          "font-mono font-bold text-lg",
                          getScoreTextColor(country.avgScore || 0)
                        )}
                      >
                        {(country.avgScore || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6"
      >
        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 light-border">
          <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
            <span className="text-sm text-[var(--text-muted)]">Score Legend:</span>
            {[
              { label: "Excellent (8.5+)", color: "bg-emerald-500" },
              { label: "Great (8.0+)", color: "bg-emerald-400" },
              { label: "Good (7.5+)", color: "bg-teal-400" },
              { label: "Average (7.0+)", color: "bg-amber-400" },
              { label: "Below Avg (6.5+)", color: "bg-orange-400" },
              { label: "Poor (<6.5)", color: "bg-red-400" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full", item.color)} />
                <span className="text-xs text-[var(--text-muted)]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
