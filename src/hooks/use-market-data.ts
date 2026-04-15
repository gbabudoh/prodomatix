"use client";

import { useEffect, useState, useCallback } from "react";
import type { Product } from "@/db/schema";

interface MarketStats {
  totalProducts: number;
  marketIndex: number;
  totalRatings: number;
  todayVolume: number;
  gainers: number;
  losers: number;
  sentiment: "Bullish" | "Bearish" | "Neutral";
}

interface LiveStatement {
  id: number;
  statement: string;
  score: string;
  countryCode: string;
  createdAt: string;
  productId: number;
  productTicker: string;
  productName: string;
}

interface CountryData {
  countryCode: string;
  countryName: string;
  avgScore: number;
  totalRatings: number;
  avgSatisfaction: number;
  avgQuality: number;
  avgFeel: number;
  avgTrendy: number;
  avgSpeculation: number;
}

// Hook for ticker tape data
export function useTickerData(refreshInterval = 5000) {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/market/ticker");
      if (!res.ok) throw new Error("Failed to fetch ticker data");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return { data, isLoading, error, refetch: fetchData };
}

// Hook for market statistics
export function useMarketStats(refreshInterval = 10000) {
  const [stats, setStats] = useState<MarketStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/market/stats");
      if (!res.ok) throw new Error("Failed to fetch market stats");
      const json = await res.json();
      setStats(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchStats, refreshInterval]);

  return { stats, isLoading, error, refetch: fetchStats };
}

// Hook for live sentiment feed
export function useLiveFeed(limit = 20, refreshInterval = 3000) {
  const [statements, setStatements] = useState<LiveStatement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = useCallback(async () => {
    try {
      const res = await fetch(`/api/statements?limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch live feed");
      const json = await res.json();
      setStatements(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchFeed();
    const interval = setInterval(fetchFeed, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchFeed, refreshInterval]);

  return { statements, isLoading, error, refetch: fetchFeed };
}

// Hook for global heatmap data
export function useGlobalHeatmap(productId?: string) {
  const [data, setData] = useState<CountryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const url = productId
        ? `/api/global/heatmap?productId=${productId}`
        : "/api/global/heatmap";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch heatmap data");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// Hook for product details
export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [recentRatings, setRecentRatings] = useState<any[]>([]);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [countryBreakdown, setCountryBreakdown] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      const json = await res.json();
      setProduct(json.product);
      setRecentRatings(json.recentRatings || []);
      setPriceHistory(json.priceHistory || []);
      setCountryBreakdown(json.countryBreakdown || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    recentRatings,
    priceHistory,
    countryBreakdown,
    isLoading,
    error,
    refetch: fetchProduct,
  };
}

// Hook for submitting a trade (rating)
export function useSubmitTrade() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitTrade = useCallback(
    async (data: {
      productId: number;
      statement: string;
      countryCode: string;
      satisfaction: number;
      quality: number;
      feel: number;
      trendy: number;
      speculation: number;
      userId?: string;
    }) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const res = await fetch("/api/trade", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const json = await res.json();
          throw new Error(json.error || "Trade failed");
        }

        const result = await res.json();
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  return { submitTrade, isSubmitting, error };
}
