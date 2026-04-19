"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gem,
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Tag,
  Sparkles,
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

export default function NsbDiscoveryPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("type", "nsb");
      if (category !== "All") params.set("category", category);
      
      const res = await fetch(`/api/npb-nsb?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings || []);
      }
    } catch (error) {
      console.error("Failed to fetch NSB listings:", error);
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
            <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-500/5">
              <Gem className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                New Services Bank <span className="text-blue-400">(NSB)</span>
              </h1>
              <p className="text-[var(--text-secondary)] mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Discover premium services and shape their market sentiment
              </p>
            </div>
          </div>
          <button 
            onClick={() => fetchListings()}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl transition-all text-sm font-medium cursor-pointer"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            Refresh Listings
          </button>
        </div>
      </motion.div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-3 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search the Service Bank..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl pl-12 pr-4 py-3.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm light-border"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl pl-12 pr-4 py-3.5 text-[var(--text-primary)] appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 shadow-sm light-border cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Consulting">Consulting</option>
            <option value="SaaS">SaaS</option>
            <option value="Finance">Finance</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-400 rounded-full animate-spin" />
          <p className="text-[var(--text-muted)] font-medium">Loading service offerings...</p>
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
          <h3 className="text-xl font-bold text-[var(--text-primary)]">No Services Active</h3>
          <p className="text-[var(--text-muted)] max-w-xs mx-auto mt-2">
            The Service Bank is currently quiet. Fresh service offerings usually land at the start of the week!
          </p>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-16 p-8 rounded-3xl bg-blue-500/5 border border-blue-500/20 flex flex-col md:flex-row items-center gap-6">
        <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-7 h-7 text-blue-400" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-blue-400">Shape the Service Market</h4>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Service providers use the **NSB** to build initial market sentiment. By rating these services, you help validate their quality for the broader community while securing exclusive launch pricing.
          </p>
        </div>
      </div>
    </div>
  );
}
