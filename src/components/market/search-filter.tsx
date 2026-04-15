"use client";

import { useMarketStore } from "@/store/market-store";
import { Input } from "@/components/shared/input";
import { Button } from "@/components/shared/button";
import { categories } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  TrendingUp,
  BarChart3,
  Type,
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
    { value: "price", label: "Prodo Score", icon: TrendingUp },
    { value: "change", label: "Change", icon: ArrowUpDown },
    { value: "volume", label: "Volume", icon: BarChart3 },
    { value: "name", label: "Name", icon: Type },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search products or tickers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <Button variant="secondary" className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setCategory(category)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer",
              selectedCategory === category
                ? "bg-emerald-500 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Sort options */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Sort by:</span>
        <div className="flex gap-1">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => {
                  if (sortBy === option.value) {
                    toggleSortOrder();
                  } else {
                    setSortBy(option.value);
                  }
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all cursor-pointer",
                  sortBy === option.value
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {option.label}
                {sortBy === option.value && (
                  <span className="text-xs">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
