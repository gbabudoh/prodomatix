"use client";

import { create } from "zustand";
import type { Product } from "@/db/schema";
import { mockProducts, mockRecentStatements } from "@/lib/mock-data";

interface RecentStatement {
  id: number;
  productTicker: string;
  productName: string;
  statement: string;
  score: number;
  countryCode: string;
  createdAt: Date;
}

interface MarketState {
  // Products/Stocks
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;

  // Ticker tape
  tickerItems: Product[];
  recentStatements: RecentStatement[];

  // Filters
  selectedCategory: string;
  searchQuery: string;
  sortBy: "price" | "change" | "volume" | "name";
  sortOrder: "asc" | "desc";

  // Actions
  setProducts: (products: Product[]) => void;
  selectProduct: (product: Product | null) => void;
  setCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: "price" | "change" | "volume" | "name") => void;
  toggleSortOrder: () => void;
  addStatement: (statement: RecentStatement) => void;
  updateProductPrice: (
    productId: number,
    newPrice: string,
    priceChange: string
  ) => void;

  // Computed
  getFilteredProducts: () => Product[];
  getTopMovers: () => { gainers: Product[]; losers: Product[] };
}

export const useMarketStore = create<MarketState>((set, get) => ({
  // Initial state
  products: mockProducts,
  selectedProduct: null,
  isLoading: false,
  tickerItems: mockProducts,
  recentStatements: mockRecentStatements,
  selectedCategory: "All",
  searchQuery: "",
  sortBy: "price",
  sortOrder: "desc",

  // Actions
  setProducts: (products) => set({ products, tickerItems: products }),

  selectProduct: (product) => set({ selectedProduct: product }),

  setCategory: (category) => set({ selectedCategory: category }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSortBy: (sortBy) => set({ sortBy }),

  toggleSortOrder: () =>
    set((state) => ({ sortOrder: state.sortOrder === "asc" ? "desc" : "asc" })),

  addStatement: (statement) =>
    set((state) => ({
      recentStatements: [statement, ...state.recentStatements.slice(0, 49)],
    })),

  updateProductPrice: (productId, newPrice, priceChange) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId
          ? {
              ...p,
              previousPrice: p.currentPrice,
              currentPrice: newPrice,
              priceChange,
            }
          : p
      ),
      tickerItems: state.tickerItems.map((p) =>
        p.id === productId
          ? {
              ...p,
              previousPrice: p.currentPrice,
              currentPrice: newPrice,
              priceChange,
            }
          : p
      ),
    })),

  // Computed getters
  getFilteredProducts: () => {
    const { products, selectedCategory, searchQuery, sortBy, sortOrder } =
      get();

    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.ticker.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "price":
          comparison =
            parseFloat(a.currentPrice || "0") -
            parseFloat(b.currentPrice || "0");
          break;
        case "change":
          comparison =
            parseFloat(a.priceChange || "0") - parseFloat(b.priceChange || "0");
          break;
        case "volume":
          comparison = (a.totalRatings || 0) - (b.totalRatings || 0);
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  },

  getTopMovers: () => {
    const { products } = get();
    const sorted = [...products].sort(
      (a, b) =>
        parseFloat(b.priceChange || "0") - parseFloat(a.priceChange || "0")
    );

    return {
      gainers: sorted.slice(0, 5),
      losers: sorted.slice(-5).reverse(),
    };
  },
}));
