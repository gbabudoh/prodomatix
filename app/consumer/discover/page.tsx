"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/shared/card";
import { Input } from "@/components/shared/input";
import { Button } from "@/components/shared/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Filter,
  Award,
  Flame,
  Clock,
  Star,
  ChevronDown,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  ticker: string;
  description: string;
  category: string;
  currentPrice: string;
  priceChange: string;
  priceChangePercent: string;
  totalRatings: number;
  hasDividendBadge: boolean;
  isAdflowPromoted: boolean;
}

const categories = [
  "All",
  "Technology",
  "Food & Beverage",
  "Fashion",
  "Entertainment",
  "Health",
  "Finance",
  "Travel",
  "Home",
  "Sports",
];

const sortOptions = [
  { value: "trending", label: "Trending", icon: Flame },
  { value: "newest", label: "Newest", icon: Clock },
  { value: "top-rated", label: "Top Rated", icon: Star },
  { value: "most-rated", label: "Most Rated", icon: TrendingUp },
];

export default function DiscoverPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("trending");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("search", searchQuery);
        if (selectedCategory !== "All") params.set("category", selectedCategory);
        params.set("sort", sortBy);

        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="p-6 md:p-8 pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Discover Products
        </h1>
        <p className="text-gray-400">
          Explore the market and find products to rate
        </p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 space-y-4"
      >
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search products or tickers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                showFilters && "rotate-180"
              )}
            />
          </Button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Sort Options */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Sort By</label>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer",
                        sortBy === option.value
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer",
                      selectedCategory === category
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, index) => {
            const change = parseFloat(product.priceChange || "0");
            const isPositive = change > 0;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/product/${product.id}`}>
                  <Card hover className="h-full">
                    {product.isAdflowPromoted && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                        Promoted
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-400 text-lg">
                            {product.ticker}
                          </span>
                          {product.hasDividendBadge && (
                            <Award className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>
                        <h3 className="text-white font-medium mt-1">
                          {product.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-white text-xl">
                          {parseFloat(product.currentPrice).toFixed(2)}
                        </div>
                        <div
                          className={cn(
                            "flex items-center justify-end gap-1 text-sm",
                            isPositive ? "text-emerald-400" : "text-red-400"
                          )}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {isPositive && "+"}
                          {change.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                      {product.description || "No description available"}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="px-2 py-1 bg-gray-800 rounded">
                        {product.category || "General"}
                      </span>
                      <span>{product.totalRatings} prodo ratings</span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">No products found</h3>
          <p className="text-gray-500 text-sm">
            Try adjusting your search or filters
          </p>
        </Card>
      )}
    </div>
  );
}
