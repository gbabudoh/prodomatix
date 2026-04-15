"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared/card";
import { countryData, mockProducts } from "@/lib/mock-data";
import { countryToFlag, formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Globe, TrendingUp, TrendingDown, Users, Filter } from "lucide-react";

export default function GlobalHeatMapPage() {
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const countries = Object.values(countryData);

  // Sort countries by score
  const sortedCountries = [...countries].sort(
    (a, b) => (b.avgScore || 0) - (a.avgScore || 0)
  );

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return "bg-emerald-500";
    if (score >= 8) return "bg-emerald-400";
    if (score >= 7.5) return "bg-teal-400";
    if (score >= 7) return "bg-yellow-400";
    if (score >= 6.5) return "bg-orange-400";
    return "bg-red-400";
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 8) return "text-emerald-400";
    if (score >= 7) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Globe className="w-8 h-8 text-emerald-400" />
            Global Heat Map
          </h1>
          <p className="text-gray-400">
            See how your products perform across different regions.
          </p>
        </div>

        {/* Product Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Products</option>
            {mockProducts.map((product) => (
              <option key={product.id} value={product.ticker}>
                {product.ticker} - {product.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* World Map Visualization (Simplified Grid) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Regional Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {sortedCountries.map((country, index) => (
                <motion.div
                  key={country.code}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group"
                >
                  <div
                    className={cn(
                      "p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition-all cursor-pointer",
                      "bg-gradient-to-br from-gray-800/50 to-gray-900/50"
                    )}
                  >
                    {/* Country flag and name */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">
                        {countryToFlag(country.code)}
                      </span>
                      <span className="text-sm font-medium text-white truncate">
                        {country.name}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Avg Score</p>
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
                        <p className="text-xs text-gray-500 mb-1">Ratings</p>
                        <p className="text-sm text-gray-400">
                          {formatNumber(country.totalRatings || 0)}
                        </p>
                      </div>
                    </div>

                    {/* Score bar */}
                    <div className="mt-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
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
          </CardContent>
        </Card>
      </motion.div>

      {/* Country Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
                Top Performing Regions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedCountries.slice(0, 5).map((country, index) => (
                  <div
                    key={country.code}
                    className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-mono text-sm w-4">
                        {index + 1}
                      </span>
                      <span className="text-xl">
                        {countryToFlag(country.code)}
                      </span>
                      <span className="text-white font-medium">
                        {country.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        <Users className="w-4 h-4 inline mr-1" />
                        {formatNumber(country.totalRatings || 0)}
                      </span>
                      <span
                        className={cn(
                          "font-mono font-bold",
                          getScoreTextColor(country.avgScore || 0)
                        )}
                      >
                        {(country.avgScore || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Needs Attention */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <TrendingDown className="w-5 h-5" />
                Regions Needing Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedCountries.slice(-5).reverse().map((country, index) => (
                  <div
                    key={country.code}
                    className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-mono text-sm w-4">
                        {sortedCountries.length - 4 + index}
                      </span>
                      <span className="text-xl">
                        {countryToFlag(country.code)}
                      </span>
                      <span className="text-white font-medium">
                        {country.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        <Users className="w-4 h-4 inline mr-1" />
                        {formatNumber(country.totalRatings || 0)}
                      </span>
                      <span
                        className={cn(
                          "font-mono font-bold",
                          getScoreTextColor(country.avgScore || 0)
                        )}
                      >
                        {(country.avgScore || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <span className="text-sm text-gray-500">Score Legend:</span>
              {[
                { label: "Excellent (8.5+)", color: "bg-emerald-500" },
                { label: "Great (8.0+)", color: "bg-emerald-400" },
                { label: "Good (7.5+)", color: "bg-teal-400" },
                { label: "Average (7.0+)", color: "bg-yellow-400" },
                { label: "Below Avg (6.5+)", color: "bg-orange-400" },
                { label: "Poor (<6.5)", color: "bg-red-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", item.color)} />
                  <span className="text-xs text-gray-400">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
