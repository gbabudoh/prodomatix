"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
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
  Grid3X3,
  List,
  Sparkles,
  ArrowUpRight,
  X,
  SlidersHorizontal,
  Rocket,
  Gem,
  ArrowRight,
} from "lucide-react";
import { LaunchCard } from "@/components/market/launch-card";

interface Listing {
  id: number;
  listingType: 'npb' | 'nsb';
  featuredImage: string | null;
  shortDescription: string | null;
  purchaseLocation: string | null;
  sentimentDiscount: string | null;
  discountCode: string | null;
  externalUrl: string | null;
  product: {
    id: number;
    name: string;
    ticker: string;
    category: string | null;
    brandName: string | null;
  };
}

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [npbListings, setNpbListings] = useState<Listing[]>([]);
  const [nsbListings, setNsbListings] = useState<Listing[]>([]);

  useEffect(() => {
    async function fetchBanks() {
      try {
        const [npbRes, nsbRes] = await Promise.all([
          fetch("/api/npb-nsb?type=npb&limit=6"),
          fetch("/api/npb-nsb?type=nsb&limit=6"),
        ]);
        
        if (npbRes.ok) {
          const data = await npbRes.json();
          setNpbListings(data.listings || []);
        }
        if (nsbRes.ok) {
          const data = await nsbRes.json();
          setNsbListings(data.listings || []);
        }
      } catch (error) {
        console.error("Failed to fetch banks:", error);
      }
    }
    fetchBanks();
  }, []);

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

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("trending");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "All" || sortBy !== "trending";

  return (
    <div className="p-6 md:p-8 pb-28 md:pb-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-1">
              Discover Products
            </h1>
            <p className="text-[var(--text-secondary)]">
              Explore the market and find products to rate
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-muted)]">{products.length} products</span>
            <div className="flex items-center bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-md transition-colors cursor-pointer",
                  viewMode === "grid"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-md transition-colors cursor-pointer",
                  viewMode === "list"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* New Products & Services Banks (NPB/NSB) */}
      {(npbListings.length > 0 || nsbListings.length > 0) && (
        <div className="space-y-12 mb-12">
          {npbListings.length > 0 && (
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
                    <Rocket className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">New Products Bank</h2>
                    <p className="text-sm text-[var(--text-muted)]">Fresh launches with sentiment incentives</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-secondary)] px-3 py-1 rounded-full border border-[var(--border-primary)]">
                    {npbListings.length} Listings
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {npbListings.map((listing, idx) => (
                  <LaunchCard key={listing.id} listing={listing} index={idx} />
                ))}
              </div>
            </motion.section>
          )}

          {nsbListings.length > 0 && (
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                    <Gem className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">New Services Bank</h2>
                    <p className="text-sm text-[var(--text-muted)]">Discover latest service offerings</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-secondary)] px-3 py-1 rounded-full border border-[var(--border-primary)]">
                    {nsbListings.length} Listings
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nsbListings.map((listing, idx) => (
                  <LaunchCard key={listing.id} listing={listing} index={idx} />
                ))}
              </div>
            </motion.section>
          )}
        </div>
      )}

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 space-y-4"
      >
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search products or tickers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl pl-12 pr-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-xl border transition-all cursor-pointer",
              showFilters
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-[var(--bg-secondary)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]"
            )}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                showFilters && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Expandable Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] p-5 space-y-5">
                {/* Sort Options */}
                <div>
                  <label className="text-sm font-medium text-[var(--text-primary)] mb-3 block">Sort By</label>
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer",
                            sortBy === option.value
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--text-muted)]"
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
                  <label className="text-sm font-medium text-[var(--text-primary)] mb-3 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer",
                          selectedCategory === category
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--text-muted)]"
                        )}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <div className="pt-3 border-t border-[var(--border-primary)]">
                    <button
                      onClick={clearFilters}
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Pills */}
        {hasActiveFilters && !showFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-[var(--text-muted)]">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm rounded-full">
                &quot;{searchQuery}&quot;
                <button onClick={() => setSearchQuery("")} className="hover:text-emerald-300 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory !== "All" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm rounded-full">
                {selectedCategory}
                <button onClick={() => setSelectedCategory("All")} className="hover:text-emerald-300 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {sortBy !== "trending" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm rounded-full">
                {sortOptions.find(o => o.value === sortBy)?.label}
                <button onClick={() => setSortBy("trending")} className="hover:text-emerald-300 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </motion.div>

      {/* Products */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-[var(--text-muted)] text-sm">Loading products...</p>
          </div>
        </div>
      ) : products.length > 0 ? (
        <div className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-3"
        )}>
          {products.map((product, index) => {
            const change = parseFloat(product.priceChange || "0");
            const isPositive = change > 0;
            
            if (viewMode === "list") {
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link href={`/product/${product.id}`}>
                    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] p-4 hover:border-emerald-500/30 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="font-mono font-bold text-emerald-400 text-sm">
                            {product.ticker.slice(0, 3)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-emerald-400">
                              {product.ticker}
                            </span>
                            {product.hasDividendBadge && (
                              <Award className="w-4 h-4 text-emerald-400" />
                            )}
                            {product.isAdflowPromoted && (
                              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Promoted
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[var(--text-muted)] truncate">{product.name}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-[var(--text-primary)] text-lg">
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
                        <ArrowUpRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-emerald-400 transition-colors" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link href={`/product/${product.id}`}>
                  <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] p-5 hover:border-emerald-500/30 transition-all cursor-pointer group h-full relative overflow-hidden">
                    {product.isAdflowPromoted && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Promoted
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                        <span className="font-mono font-bold text-emerald-400 text-sm">
                          {product.ticker.slice(0, 3)}
                        </span>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-emerald-400 transition-colors" />
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-emerald-400 text-lg">
                          {product.ticker}
                        </span>
                        {product.hasDividendBadge && (
                          <Award className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                      <h3 className="text-[var(--text-primary)] font-medium">
                        {product.name}
                      </h3>
                    </div>

                    <p className="text-[var(--text-muted)] text-sm line-clamp-2 mb-4">
                      {product.description || "No description available"}
                    </p>

                    <div className="flex items-end justify-between pt-3 border-t border-[var(--border-primary)]">
                      <div>
                        <div className="font-mono font-bold text-[var(--text-primary)] text-2xl">
                          {parseFloat(product.currentPrice).toFixed(2)}
                        </div>
                        <div
                          className={cn(
                            "flex items-center gap-1 text-sm",
                            isPositive ? "text-emerald-400" : "text-red-400"
                          )}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {isPositive && "+"}
                          {change.toFixed(2)} ({product.priceChangePercent || "0"}%)
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 bg-[var(--bg-tertiary)] text-[var(--text-muted)] text-xs rounded-lg">
                          {product.category || "General"}
                        </span>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          {product.totalRatings} ratings
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)]"
        >
          <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-[var(--text-primary)] font-semibold mb-2">No products found</h3>
          <p className="text-[var(--text-muted)] text-sm mb-4">
            Try adjusting your search or filters
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
