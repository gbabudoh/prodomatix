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
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Input
            placeholder="Search products, tickers, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
            className="pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--bg-tertiary)] rounded-md transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-[var(--text-muted)]" />
            </button>
          )}
        </div>
        <Button variant="secondary" className="flex items-center gap-2 px-4">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </Button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent -mx-1 px-1">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setCategory(category)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer border",
              selectedCategory === category
                ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--border-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-muted)]">Sort by:</span>
          <div className="flex gap-1 p-1 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)]">
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
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{option.label}</span>
                  {isActive && (
                    <span className="text-xs font-bold">
                      {sortOrder === "asc" ? "↑" : "↓"}
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
