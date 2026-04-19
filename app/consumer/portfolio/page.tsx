"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart3,
  RefreshCw,
  Search,
  ChevronRight,
  History,
  Rocket
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/shared/button";

interface Holding {
  id: number;
  productId: number;
  quantity: number;
  avgPurchasePrice: number;
  ticker: string;
  name: string;
  currentPrice: string;
  priceChange: string;
  priceChangePercent: string;
  status: string;
  currentValue: number;
  costBasis: number;
  profitLoss: number;
  profitLossPercent: number;
}

interface Transaction {
  id: number;
  productId: number;
  type: string;
  quantity: string;
  pricePerShare: string;
  totalValue: string;
  performanceAtTime: string;
  timestamp: string;
}

interface PortfolioData {
  holdings: Holding[];
  stats: {
    totalValue: number;
    totalProfitLoss: number;
    profitLossPercent: number;
    holdingCount: number;
  };
  recentTransactions: Transaction[];
}

export default function PortfolioPage() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch("/api/consumer/portfolio");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setError("Market Sync Failed");
      }
    } catch (err) {
      setError("Connection Lost");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-[var(--text-muted)]">Calculating Portfolio Alpha...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <BarChart3 className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold mb-2">Market Data Unavailable</h2>
        <p className="text-[var(--text-muted)] mb-6">{error || "Failed to load holdings"}</p>
        <Button onClick={fetchPortfolio}>Retry Sync</Button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto pb-32">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
            <Briefcase className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Personal Portfolio</h1>
        </div>
        <p className="text-[var(--text-secondary)]">Track your sentiment assets and historical performance.</p>
      </header>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border border-[var(--border-primary)] shadow-xl"
        >
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">Total Market Value</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono text-white">
              {data.stats.totalValue.toFixed(2)}
            </span>
            <span className="text-sm font-bold text-blue-400">CREDITS</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-3xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border border-[var(--border-primary)] shadow-xl"
        >
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">Total Profit/Loss</p>
          <div className="flex flex-col">
            <div className={cn(
              "text-3xl font-black font-mono flex items-center gap-2",
              data.stats.totalProfitLoss >= 0 ? "text-emerald-400" : "text-red-400"
            )}>
              {data.stats.totalProfitLoss >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
              {Math.abs(data.stats.totalProfitLoss).toFixed(2)}
            </div>
            <span className={cn(
              "text-sm font-bold",
              data.stats.totalProfitLoss >= 0 ? "text-emerald-500/70" : "text-red-500/70"
            )}>
              {data.stats.profitLossPercent >= 0 ? "+" : ""}{data.stats.profitLossPercent.toFixed(2)}% Over Cost
            </span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-3xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border border-[var(--border-primary)] shadow-xl"
        >
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">Asset Listings</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono text-white">
              {data.stats.holdingCount}
            </span>
            <span className="text-sm font-bold text-[var(--text-muted)]">Holdings</span>
          </div>
        </motion.div>
      </div>

      {/* Holdings Table */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Active Holdings</h2>
          </div>
          <Link href="/consumer/discovery">
            <Button variant="secondary" size="sm" className="gap-2">
              <Search className="w-4 h-4" />
              Find More Assets
            </Button>
          </Link>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-primary)] overflow-hidden shadow-2xl">
          {data.holdings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-tertiary)]/50 border-b border-[var(--border-primary)]">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Listing</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Shares</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Avg Cost / Price</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right">Market Value</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right">Profit/Loss</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-primary)]">
                  {data.holdings.map((holding) => (
                    <tr key={holding.id} className="group hover:bg-white/5 transition-all">
                      <td className="px-6 py-5">
                        <Link href={`/product/${holding.productId}`}>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                              {holding.ticker}
                            </span>
                            <span className="text-xs text-[var(--text-muted)] truncate max-w-[150px]">
                              {holding.name}
                            </span>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-5 font-mono text-sm font-bold text-white">
                        {holding.quantity.toLocaleString()}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-xs font-mono text-[var(--text-muted)]">Avg: {holding.avgPurchasePrice.toFixed(2)}</span>
                          <span className="text-xs font-mono font-bold text-emerald-400">Cur: {parseFloat(holding.currentPrice).toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-mono text-sm font-black text-white">
                        {holding.currentValue.toFixed(2)}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex flex-col items-end">
                          <span className={cn(
                            "text-sm font-black font-mono",
                            holding.profitLoss >= 0 ? "text-emerald-400" : "text-red-400"
                          )}>
                            {holding.profitLoss >= 0 ? "+" : ""}{holding.profitLoss.toFixed(2)}
                          </span>
                          <span className={cn(
                            "text-[10px] font-bold uppercase",
                            holding.profitLossPercent >= 0 ? "text-emerald-500/50" : "text-red-500/50"
                          )}>
                            {holding.profitLossPercent.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Link href={`/product/${holding.productId}`}>
                          <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-400 transition-all">
                            <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-white" />
                          </div>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center mb-6 border border-[var(--border-primary)] border-dashed">
                <Rocket className="w-8 h-8 text-[var(--text-muted)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">No Assets in Portfolio</h3>
              <p className="text-sm text-[var(--text-muted)] max-w-sm mb-8">
                Early scouts receive free share grants for discovering IPS products. Start discovery and rating to build your assets.
              </p>
              <Link href="/consumer/discovery">
                <Button>Go Discover Products</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Transaction History */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Trade Ledger</h2>
        </div>
        <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-primary)] overflow-hidden">
          {data.recentTransactions.length > 0 ? (
            <div className="divide-y divide-[var(--border-primary)]">
              {data.recentTransactions.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border",
                      tx.type === 'BUY' ? "bg-emerald-500/10 border-emerald-500/20" :
                      tx.type === 'GRANT' ? "bg-blue-500/10 border-blue-500/20" :
                      "bg-amber-500/10 border-amber-500/20"
                    )}>
                      {tx.type === 'BUY' ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : 
                       tx.type === 'GRANT' ? <Rocket className="w-5 h-5 text-blue-400" /> :
                       <TrendingDown className="w-5 h-5 text-amber-400" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-black text-white uppercase tracking-tight">
                          {tx.type} SHARES
                        </span>
                        <span className="text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full">
                          {new Date(tx.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)] font-mono">
                        Price: {parseFloat(tx.pricePerShare).toFixed(4)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "font-mono font-black text-sm",
                      tx.type === 'GRANT' ? "text-blue-400" : "text-white"
                    )}>
                      {parseFloat(tx.quantity).toLocaleString()} Units
                    </div>
                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                      {tx.type === 'GRANT' ? 'Analyst Grant' : `${parseFloat(tx.totalValue).toFixed(2)} Credits`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-[var(--text-muted)] text-sm italic">
              No transactions recorded in the market history.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
