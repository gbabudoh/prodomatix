"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Tag,
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

export default function NpbDiscoveryPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("type", "npb");
      if (category !== "All") params.set("category", category);
      
      const res = await fetch(`/api/npb-nsb?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings || []);
      }
    } catch (error) {
      console.error("Failed to fetch NPB listings:", error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const filteredListings = listings.filter(l => 
    l.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.product.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.product.brandName && l.product.brandName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 pb-32 md:pb-8 max-w-[1400px] mx-auto min-h-screen">
      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-orange-500/10 rounded-3xl flex items-center justify-center border border-orange-500/20 shadow-lg shadow-orange-500/5">
              <Rocket className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                New Products Bank <span className="text-orange-400">(NPB)</span>
              </h1>
              <p className="text-[var(--text-secondary)] mt-1 flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-400" />
                Rate new releases to unlock exclusive sentiment discounts
              </p>
            </div>
          </div>
          <button 
            onClick={() => fetchListings()}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl transition-all text-sm font-medium cursor-pointer"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            Sync Bank Data
          </button>
        </div>
      </motion.div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-3 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search the Product Bank..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl pl-12 pr-4 py-3.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all shadow-sm light-border"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl pl-12 pr-4 py-3.5 text-[var(--text-primary)] appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 shadow-sm light-border cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Food & Beverage">Food & Beverage</option>
            <option value="Fashion">Fashion</option>
            <option value="Entertainment">Entertainment</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-400 rounded-full animate-spin" />
          <p className="text-[var(--text-muted)] font-medium">Scanning the Bank for new products...</p>
        </div>
      ) : filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map((listing, idx) => (
            <LaunchCard key={listing.id} listing={listing} index={idx} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-primary)] border-dashed">
          <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)]">No Listings Found</h3>
          <p className="text-[var(--text-muted)] max-w-xs mx-auto mt-2">
            The Product Bank is currently waiting for new business submissions. Check back soon!
          </p>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-16 p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col md:flex-row items-center gap-6">
        <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-7 h-7 text-emerald-400" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-emerald-400">Discover & Earn</h4>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Product owners offer **Sentiment Discounts** in exchange for early community feedback. 
            Once you provide a rating, the discount code will be instantly revealed in your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
