"use client";

import { useMarketStore } from "@/store/market-store";
import { Card, CardHeader, CardTitle } from "@/components/shared/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Award } from "lucide-react";
import Link from "next/link";

export function TopMovers() {
  const { getTopMovers } = useMarketStore();
  const { gainers, losers } = getTopMovers();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Top Gainers */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
            Top Gainers
          </CardTitle>
        </CardHeader>
        <div className="space-y-2">
          {gainers.map((product, index) => {
            const priceChange = parseFloat(product.priceChange || "0");
            const priceChangePercent = parseFloat(
              product.priceChangePercent || "0"
            );

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 font-mono text-sm w-4">
                    {index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {product.ticker}
                      </span>
                      {product.hasDividendBadge && (
                        <Award className="w-3 h-3 text-emerald-400" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500 truncate max-w-[100px] block">
                      {product.name}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Prodo</div>
                  <div className="font-mono text-white">
                    {parseFloat(product.currentPrice || "0").toFixed(2)}
                  </div>
                  <div className="text-emerald-400 text-sm font-medium">
                    +{priceChange.toFixed(2)} (+{priceChangePercent.toFixed(1)}
                    %)
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Card>

      {/* Top Losers */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <TrendingDown className="w-5 h-5" />
            Top Losers
          </CardTitle>
        </CardHeader>
        <div className="space-y-2">
          {losers.map((product, index) => {
            const priceChange = parseFloat(product.priceChange || "0");
            const priceChangePercent = parseFloat(
              product.priceChangePercent || "0"
            );

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 font-mono text-sm w-4">
                    {index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-white group-hover:text-red-400 transition-colors">
                        {product.ticker}
                      </span>
                      {product.hasDividendBadge && (
                        <Award className="w-3 h-3 text-emerald-400" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500 truncate max-w-[100px] block">
                      {product.name}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Prodo</div>
                  <div className="font-mono text-white">
                    {parseFloat(product.currentPrice || "0").toFixed(2)}
                  </div>
                  <div className="text-red-400 text-sm font-medium">
                    {priceChange.toFixed(2)} ({priceChangePercent.toFixed(1)}%)
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
