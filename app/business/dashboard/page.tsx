"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/shared/button";
import { useAuthStore } from "@/store/auth-store";
import { formatNumber, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Megaphone,
  Package,
  Globe,
  Zap,
  ChevronRight,
  Rocket,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  ticker: string;
  currentPrice: string;
  priceChange: string;
  priceChangePercent: string;
  totalRatings: number;
  hasDividendBadge: boolean;
  isAdflowPromoted: boolean;
  status: string;
}

interface DashboardStats {
  totalProducts: number;
  totalRatings: number;
  avgScore: number;
  dividendBadges: number;
  activePromotions: number;
  weeklyChange: {
    products: number;
    ratings: number;
    score: number;
  };
}

export default function BusinessDashboardPage() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalRatings: 0,
    avgScore: 0,
    dividendBadges: 0,
    activePromotions: 0,
    weeklyChange: { products: 0, ratings: 0, score: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch("/api/owner/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
          setStats(data.stats || stats);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      label: "Total Products",
      value: stats.totalProducts.toString(),
      change: `+${stats.weeklyChange.products}`,
      trend: stats.weeklyChange.products > 0 ? "up" : "neutral",
      icon: Package,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      label: "Total Ratings",
      value: formatNumber(stats.totalRatings),
      change: `+${stats.weeklyChange.ratings}`,
      trend: stats.weeklyChange.ratings > 0 ? "up" : "neutral",
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      label: "Average Score",
      value: stats.avgScore.toFixed(2),
      change: stats.weeklyChange.score >= 0 ? `+${stats.weeklyChange.score.toFixed(2)}` : stats.weeklyChange.score.toFixed(2),
      trend: stats.weeklyChange.score > 0 ? "up" : stats.weeklyChange.score < 0 ? "down" : "neutral",
      icon: Activity,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      label: "Trust Badges",
      value: stats.dividendBadges.toString(),
      change: "Earned",
      trend: "neutral",
      icon: Award,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      label: "Active Promotions",
      value: stats.activePromotions?.toString() || "0",
      change: "Bank Listings",
      trend: "neutral",
      icon: Rocket,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
    },
  ];

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-muted)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-1">
              Welcome back, {user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-[var(--text-muted)]">
              Track your products and services performance across the global sentiment market.
            </p>
          </div>
          <Link href="/business/dashboard/portfolio">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Product IPS
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={cn(
                "p-4 md:p-5 rounded-2xl border bg-[var(--bg-secondary)] light-border",
                stat.borderColor
              )}>
                <div className="flex items-start justify-between mb-3">
                  <div className={cn("p-2 md:p-2.5 rounded-xl", stat.bgColor)}>
                    <Icon className={cn("w-4 h-4 md:w-5 md:h-5", stat.color)} />
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                      stat.trend === "up" && "text-emerald-400 bg-emerald-500/10",
                      stat.trend === "down" && "text-red-400 bg-red-500/10",
                      stat.trend === "neutral" && "text-[var(--text-muted)] bg-[var(--bg-tertiary)]"
                    )}
                  >
                    {stat.trend === "up" && <ArrowUpRight className="w-3 h-3" />}
                    {stat.trend === "down" && <ArrowDownRight className="w-3 h-3" />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-[var(--text-muted)] mb-1">{stat.label}</p>
                <p className={cn("text-xl md:text-2xl lg:text-3xl font-bold", stat.color)}>
                  {stat.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6 md:mb-8"
      >
        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] overflow-hidden light-border">
          <div className="p-4 md:p-5 border-b border-[var(--border-primary)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Your Products & Services</h2>
              <p className="text-sm text-[var(--text-muted)]">Manage and track your portfolio</p>
            </div>
            <Link href="/business/dashboard/portfolio">
              <Button variant="secondary" size="sm" className="flex items-center gap-2">
                View All
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50">
                    <th className="text-left py-3 px-4 md:px-5 text-[var(--text-muted)] font-medium text-xs uppercase tracking-wider">
                      Product
                    </th>
                    <th className="text-right py-3 px-4 md:px-5 text-[var(--text-muted)] font-medium text-xs uppercase tracking-wider">
                      Score
                    </th>
                    <th className="text-right py-3 px-4 md:px-5 text-[var(--text-muted)] font-medium text-xs uppercase tracking-wider hidden md:table-cell">
                      Change
                    </th>
                    <th className="text-right py-3 px-4 md:px-5 text-[var(--text-muted)] font-medium text-xs uppercase tracking-wider hidden lg:table-cell">
                      Ratings
                    </th>
                    <th className="text-right py-3 px-4 md:px-5 text-[var(--text-muted)] font-medium text-xs uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 5).map((product) => {
                    const priceChange = parseFloat(product.priceChange || "0");
                    const isPositive = priceChange > 0;
                    const isNegative = priceChange < 0;

                    return (
                      <tr
                        key={product.id}
                        className="border-b border-[var(--border-primary)] last:border-0 hover:bg-[var(--bg-tertiary)]/50 transition-colors"
                      >
                        <td className="py-4 px-4 md:px-5">
                          <Link href={`/product/${product.id}`} className="block">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-blue-500/20">
                                <span className="font-mono font-bold text-blue-400 text-sm">
                                  {product.ticker.slice(0, 2)}
                                </span>
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-blue-400">
                                    {product.ticker}
                                  </span>
                                  {product.hasDividendBadge && (
                                    <Award className="w-4 h-4 text-amber-400" />
                                  )}
                                </div>
                                <span className="text-sm text-[var(--text-muted)] line-clamp-1">
                                  {product.name}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td className="py-4 px-4 md:px-5 text-right">
                          <span className="font-mono font-bold text-[var(--text-primary)] text-lg">
                            {parseFloat(product.currentPrice || "0").toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 px-4 md:px-5 text-right hidden md:table-cell">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 font-medium text-sm",
                              isPositive && "text-emerald-400",
                              isNegative && "text-red-400",
                              !isPositive && !isNegative && "text-[var(--text-muted)]"
                            )}
                          >
                            {isPositive && <TrendingUp className="w-4 h-4" />}
                            {isNegative && <TrendingDown className="w-4 h-4" />}
                            {isPositive && "+"}
                            {priceChange.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 px-4 md:px-5 text-right text-[var(--text-muted)] hidden lg:table-cell">
                          {formatNumber(product.totalRatings || 0)}
                        </td>
                        <td className="py-4 px-4 md:px-5 text-right">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
                              product.status === "active" &&
                                "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                              product.status === "ipo" &&
                                "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                              product.isAdflowPromoted &&
                                "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            )}
                          >
                            {product.isAdflowPromoted && <Zap className="w-3 h-3" />}
                            {product.isAdflowPromoted
                              ? "Promoted"
                              : product.status === "ipo"
                              ? "IPS"
                              : "Active"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] flex items-center justify-center">
                <Package className="w-8 h-8 text-[var(--text-muted)]" />
              </div>
              <h3 className="text-[var(--text-primary)] font-semibold mb-2">No products or services yet</h3>
              <p className="text-[var(--text-muted)] text-sm mb-4 max-w-sm mx-auto">
                Launch your first product or service IPS to start tracking sentiment and building your portfolio.
              </p>
              <Link href="/business/dashboard/portfolio">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/business/dashboard/portfolio">
            <div className="p-5 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent hover:from-emerald-500/10 transition-all cursor-pointer group light-border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Add New Product / Service</h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    Launch a new IPS
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--text-muted)] ml-auto group-hover:text-emerald-400 transition-colors" />
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/business/dashboard/adflow">
            <div className="p-5 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent hover:from-amber-500/10 transition-all cursor-pointer group light-border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                  <Megaphone className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Boost with AdFLOW</h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    Promote your products & services
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--text-muted)] ml-auto group-hover:text-amber-400 transition-colors" />
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link href="/business/dashboard/global">
            <div className="p-5 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent hover:from-blue-500/10 transition-all cursor-pointer group light-border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Global Analytics</h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    See worldwide sentiment
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--text-muted)] ml-auto group-hover:text-blue-400 transition-colors" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
