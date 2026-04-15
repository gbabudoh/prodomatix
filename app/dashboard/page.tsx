"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared/card";
import { Button } from "@/components/shared/button";
import { useAuthStore } from "@/store/auth-store";
import { formatNumber, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Megaphone,
  Eye,
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
  weeklyChange: {
    products: number;
    ratings: number;
    score: number;
  };
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalRatings: 0,
    avgScore: 0,
    dividendBadges: 0,
    weeklyChange: { products: 0, ratings: 0, score: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch owner's products
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
      icon: BarChart3,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Total Ratings",
      value: formatNumber(stats.totalRatings),
      change: `+${stats.weeklyChange.ratings}`,
      trend: stats.weeklyChange.ratings > 0 ? "up" : "neutral",
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Average Score",
      value: stats.avgScore.toFixed(2),
      change: stats.weeklyChange.score >= 0 ? `+${stats.weeklyChange.score.toFixed(2)}` : stats.weeklyChange.score.toFixed(2),
      trend: stats.weeklyChange.score > 0 ? "up" : stats.weeklyChange.score < 0 ? "down" : "neutral",
      icon: Activity,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Dividend Badges",
      value: stats.dividendBadges.toString(),
      change: "0",
      trend: "neutral",
      icon: Award,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Welcome back, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-gray-400">
          Track your products&apos; performance across the global sentiment market.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 text-xs md:text-sm">{stat.label}</p>
                    <p className={`text-xl md:text-3xl font-bold ${stat.color} mt-1`}>
                      {stat.value}
                    </p>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-xs md:text-sm mt-2",
                        stat.trend === "up" && "text-emerald-400",
                        stat.trend === "down" && "text-red-400",
                        stat.trend === "neutral" && "text-gray-500"
                      )}
                    >
                      {stat.trend === "up" && (
                        <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
                      )}
                      {stat.trend === "down" && (
                        <ArrowDownRight className="w-3 h-3 md:w-4 md:h-4" />
                      )}
                      <span>{stat.change} this week</span>
                    </div>
                  </div>
                  <div className={`p-2 md:p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Products</CardTitle>
            <Link href="/dashboard/portfolio">
              <Button variant="secondary" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Product
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">
                        Product
                      </th>
                      <th className="text-right py-3 px-4 text-gray-500 font-medium text-sm">
                        Score
                      </th>
                      <th className="text-right py-3 px-4 text-gray-500 font-medium text-sm hidden md:table-cell">
                        Change
                      </th>
                      <th className="text-right py-3 px-4 text-gray-500 font-medium text-sm hidden md:table-cell">
                        Ratings
                      </th>
                      <th className="text-right py-3 px-4 text-gray-500 font-medium text-sm">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => {
                      const priceChange = parseFloat(product.priceChange || "0");
                      const isPositive = priceChange > 0;
                      const isNegative = priceChange < 0;

                      return (
                        <tr
                          key={product.id}
                          className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <Link href={`/product/${product.id}`}>
                              <div className="flex items-center gap-3">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-emerald-400">
                                      {product.ticker}
                                    </span>
                                    {product.hasDividendBadge && (
                                      <Award className="w-4 h-4 text-emerald-400" />
                                    )}
                                  </div>
                                  <span className="text-sm text-gray-400">
                                    {product.name}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="font-mono font-bold text-white">
                              {parseFloat(product.currentPrice || "0").toFixed(2)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right hidden md:table-cell">
                            <span
                              className={cn(
                                "flex items-center justify-end gap-1 font-medium",
                                isPositive && "text-emerald-400",
                                isNegative && "text-red-400",
                                !isPositive && !isNegative && "text-gray-500"
                              )}
                            >
                              {isPositive && <TrendingUp className="w-4 h-4" />}
                              {isNegative && <TrendingDown className="w-4 h-4" />}
                              {isPositive && "+"}
                              {priceChange.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right text-gray-400 hidden md:table-cell">
                            {formatNumber(product.totalRatings || 0)}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                product.status === "active" &&
                                  "bg-emerald-500/20 text-emerald-400",
                                product.status === "ipo" &&
                                  "bg-blue-500/20 text-blue-400",
                                product.isAdflowPromoted &&
                                  "bg-yellow-500/20 text-yellow-400"
                              )}
                            >
                              {product.isAdflowPromoted
                                ? "Promoted"
                                : product.status === "ipo"
                                ? "IPO"
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
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">No products yet</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Launch your first product IPO to start tracking sentiment
                </p>
                <Link href="/dashboard/portfolio">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Product
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/dashboard/portfolio">
            <Card
              hover
              className="cursor-pointer bg-gradient-to-br from-emerald-500/10 to-transparent"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Add New Product</h3>
                  <p className="text-sm text-gray-400">
                    Launch a new product IPO
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/dashboard/adflow">
            <Card
              hover
              className="cursor-pointer bg-gradient-to-br from-yellow-500/10 to-transparent"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <Megaphone className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Boost with AdFLOW</h3>
                  <p className="text-sm text-gray-400">
                    Promote your products
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link href="/dashboard/global">
            <Card
              hover
              className="cursor-pointer bg-gradient-to-br from-blue-500/10 to-transparent"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Global Heat Map</h3>
                  <p className="text-sm text-gray-400">
                    See worldwide sentiment
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
