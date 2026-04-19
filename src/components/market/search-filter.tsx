"use client";

import { useMarketStore } from "@/store/market-store";
import { Input } from "@/components/shared/input";
import { Button } from "@/components/shared/button";
import { categories } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  BarChart3,
  Type,
  ArrowUpDown,
  X,
} from "lucide-react";

export function SearchFilter() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setCategory,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
  } = useMarketStore();

  const sortOptions = [
    { value: "price", label: "Score", icon: TrendingUp },
    { value: "change", label: "Change", icon: ArrowUpDown },
    { value: "volume", label: "Volume", icon: BarChart3 },
    { value: "name", label: "Name", icon: Type },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3 relative z-20">
        <div className="flex-1 relative group">
          <div className="absolute inset-0 bg-emerald-500/5 rounded-xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          <Input
            placeholder="Search markets, tickers, or trends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4 text-emerald-400/70" />}
            className="pr-10 glass border-[var(--border-primary)] focus:border-emerald-500/50 bg-[var(--bg-secondary)]/50 backdrop-blur-xl rounded-xl transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-emerald-500/20 rounded-lg transition-colors cursor-pointer group"
            >
              <X className="w-4 h-4 text-[var(--text-muted)] group-hover:text-emerald-400" />
            </button>
          )}
        </div>
        <Button variant="secondary" className="glass flex items-center gap-2 px-5 rounded-xl hover:border-emerald-500/30 transition-all shadow-lg active:scale-95">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline font-bold">Filters</span>
        </Button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent -mx-1 px-1 relative z-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setCategory(category)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer border",
              selectedCategory === category
                ? "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-105"
                : "glass text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-emerald-500/40 hover:text-emerald-400 hover:scale-[1.02]"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Sort Analytics:</span>
          <div className="flex gap-1.5 p-1 glass rounded-xl border border-[var(--border-primary)] shadow-inner">
            {sortOptions.map((option) => {
              const Icon = option.icon;
              const isActive = sortBy === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    if (isActive) {
                      toggleSortOrder();
                    } else {
                      setSortBy(option.value);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    isActive
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                      : "text-[var(--text-muted)] hover:text-emerald-300 hover:bg-white/5"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline uppercase tracking-tighter">{option.label}</span>
                  {isActive && (
                    <span className="text-[10px] translate-y-[1px]">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Results count */}
        {searchQuery && (
          <span className="text-sm text-[var(--text-muted)]">
            Showing results for &quot;{searchQuery}&quot;
          </span>
        )}
      </div>
    </div>
  );
}
