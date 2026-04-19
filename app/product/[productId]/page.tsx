"use client";

import { use, useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMarketStore } from "@/store/market-store";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/shared/button";
import { Slider } from "@/components/shared/slider";
import { Input } from "@/components/shared/input";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { validateTenWordStatement, formatNumber } from "@/lib/utils";
import { calculateWeightedScore } from "@/lib/calculate-score";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { trackAction } from "@/lib/tracking-client";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  Share2,
  Heart,
  Globe,
  Sparkles,
  BarChart3,
  Clock,
  Star,
  CheckCircle,
  Info,
  ChevronRight,
  Zap,
  Target,
  Smile,
  Gem,
  Rocket,
  ExternalLink,
  ShoppingBag,
  Tag,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  ticker: string;
  description: string | null;
  category: string | null;
  currentPrice: string;
  previousPrice: string;
  priceChange: string;
  priceChangePercent: string;
  totalRatings: number;
  status: string;
  isAdflowPromoted: boolean;
  hasDividendBadge: boolean;
  dividendStreakDays: number;
  sentimentDiscount: string | null;
  sentimentDiscountCode: string | null;
  purchaseUrl: string | null;
  externalPageUrl: string | null;
  totalShares: string;
  availableShares: string;
}

interface PriceHistoryPoint {
  price: string;
  recordedAt: string;
}

interface PortfolioHolding {
  productId: number;
  quantity: number;
  avgPurchasePrice: number;
}

interface PageProps {
  params: Promise<{ productId: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const { productId } = use(params);
  const router = useRouter();
  const { addStatement } = useMarketStore();
  const { isAuthenticated, user, checkAuth } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backLabel, setBackLabel] = useState("Back");

  // Rating form state
  const [statement, setStatement] = useState("");
  const [satisfaction, setSatisfaction] = useState(5);
  const [quality, setQuality] = useState(5);
  const [feel, setFeel] = useState(5);
  const [trendy, setTrendy] = useState(5);
  const [speculation, setSpeculation] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Share purchase state
  const [buyQuantity, setBuyQuantity] = useState("10");
  const [isBuying, setIsBuying] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);
  const [userHoldings, setUserHoldings] = useState<{ quantity: number; avgPrice: number } | null>(null);

  // Detect where user came from using sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const lastPath = sessionStorage.getItem("lastVisitedPath") || "/";
      if (lastPath === "/" || lastPath === "") {
        setBackLabel("Back to Homepage");
      } else if (lastPath.includes("/consumer")) {
        setBackLabel("Back to Dashboard");
      } else if (lastPath.includes("/business/dashboard")) {
        setBackLabel("Back to Dashboard");
      } else {
        setBackLabel("Back to Homepage");
      }
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Fetch product data from API
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Product not found");
          } else {
            setError("Failed to load product");
          }
          return;
        }
        const data = await res.json();
        setProduct(data.product);
        setPriceHistory(data.priceHistory || []);
        
        // Fetch user shares if authenticated
        if (isAuthenticated && user?.id) {
          const portfolioRes = await fetch('/api/consumer/portfolio');
          if (portfolioRes.ok) {
            const portfolioData = await portfolioRes.json();
            const holding = portfolioData.holdings.find((h: PortfolioHolding) => h.productId === data.product.id);
            if (holding) {
              setUserHoldings({ quantity: holding.quantity, avgPrice: holding.avgPurchasePrice });
            }
          }
        }

        // Track the view for the Behaviour Algorithm
        trackAction(data.product.id, 'view');
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  const statementValidation = validateTenWordStatement(statement);

  const previewScore = useMemo(() => {
    return calculateWeightedScore({
      satisfaction,
      quality,
      feel,
      trendy,
      speculation,
    });
  }, [satisfaction, quality, feel, trendy, speculation]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-muted)]">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error/Not found state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center light-border">
            <BarChart3 className="w-10 h-10 text-[var(--text-muted)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Product Not Found
          </h1>
          <p className="text-[var(--text-muted)] mb-6">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/">
            <Button>Back to Market</Button>
          </Link>
        </div>
      </div>
    );
  }

  const priceChange = parseFloat(product.priceChange || "0");
  const priceChangePercent = parseFloat(product.priceChangePercent || "0");
  const currentPrice = parseFloat(product.currentPrice || "0");
  const isPositive = priceChange > 0;
  const isNegative = priceChange < 0;

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-400";
    if (score >= 6) return "text-amber-400";
    if (score >= 4) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return "bg-emerald-500/10 border-emerald-500/20";
    if (score >= 6) return "bg-amber-500/10 border-amber-500/20";
    if (score >= 4) return "bg-orange-500/10 border-orange-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  const handleSubmit = async () => {
    if (!statementValidation.valid) return;

    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          tenWordStatement: statement,
          satisfaction,
          quality,
          feel,
          trendy,
          speculation,
          userId: user?.id || null,
          countryCode: user?.countryCode || "US",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        addStatement({
          id: Date.now(),
          productTicker: product.ticker,
          productName: product.name,
          statement,
          score: previewScore,
          countryCode: user?.countryCode || "US",
          createdAt: new Date(),
        });
        
        // Update the product score immediately using the API response
        if (data.newScore !== undefined) {
          const newScore = parseFloat(data.newScore);
          const previousPrice = parseFloat(product.currentPrice || "0");
          const priceChange = newScore - previousPrice;
          const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0;
          
          setProduct({
            ...product,
            previousPrice: product.currentPrice,
            currentPrice: newScore.toFixed(2),
            priceChange: priceChange.toFixed(2),
            priceChangePercent: priceChangePercent.toFixed(2),
            totalRatings: product.totalRatings + 1,
          });
        }
        
        setSubmitted(true);
        
        // Track the rating action for Behaviour Algorithm
        trackAction(product.id, 'rate');
      } else {
        console.error("Rating submission failed:", data.error);
        alert(data.error || "Failed to submit rating. Please try again.");
      }
    } catch (err) {
      console.error("Failed to submit rating:", err);
      alert("Failed to submit rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyShares = async () => {
    if (!buyQuantity || parseFloat(buyQuantity) <= 0) return;

    setIsBuying(true);
    try {
      const res = await fetch("/api/trades/shares/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: buyQuantity,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setBuySuccess(true);
        // Refresh product and user info
        await checkAuth(); // Refresh credits
        
        const resProd = await fetch(`/api/products/${product.id}`);
        if (resProd.ok) {
          const dataProd = await resProd.json();
          setProduct(dataProd.product);
        }

        const portfolioRes = await fetch('/api/consumer/portfolio');
        if (portfolioRes.ok) {
          const portfolioData = await portfolioRes.json();
          const holding = portfolioData.holdings.find((h: PortfolioHolding) => h.productId === product.id);
          if (holding) {
            setUserHoldings({ quantity: holding.quantity, avgPrice: holding.avgPurchasePrice });
          }
        }
        
        setTimeout(() => setBuySuccess(false), 5000);
      } else {
        alert(data.error || "Failed to purchase shares.");
      }
    } catch (err) {
      console.error("Purchase failed:", err);
      alert("Failed to purchase shares. Please try again.");
    } finally {
      setIsBuying(false);
    }
  };

  const indicators = [
    { key: "satisfaction", label: "Satisfaction", icon: Smile, value: satisfaction, setValue: setSatisfaction, weight: "25%", description: "Overall satisfaction with the product" },
    { key: "quality", label: "Quality", icon: Gem, value: quality, setValue: setQuality, weight: "25%", description: "Build quality and craftsmanship" },
    { key: "feel", label: "Feel", icon: Heart, value: feel, setValue: setFeel, weight: "20%", description: "Emotional connection and experience" },
    { key: "trendy", label: "Trendy", icon: Zap, value: trendy, setValue: setTrendy, weight: "15%", description: "Current relevance and popularity" },
    { key: "speculation", label: "Speculation", icon: Rocket, value: speculation, setValue: setSpeculation, weight: "15%", description: "Future potential and growth" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]/80 backdrop-blur-xl light-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">{backLabel}</span>
              </button>
              <div className="hidden sm:block w-px h-6 bg-[var(--border-primary)]" />
              <div className="hidden sm:flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <span>Products</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[var(--text-primary)] font-medium">{product.ticker}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ThemeToggle variant="icon" />
              <Button
                variant={isFollowing ? "primary" : "secondary"}
                size="sm"
                onClick={() => setIsFollowing(!isFollowing)}
                className="flex items-center gap-2"
              >
                <Heart className={cn("w-4 h-4", isFollowing && "fill-current")} />
                <span className="hidden sm:inline">{isFollowing ? "Following" : "Follow"}</span>
              </Button>
              <Button variant="secondary" size="sm" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-8">
        {/* Product Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="relative overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] light-border">
            {/* Background - contained properly */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />
            
            {/* Featured Badge - positioned safely */}
            {product.isAdflowPromoted && (
              <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-bold text-white">Featured</span>
              </div>
            )}

            <div className="relative p-5 sm:p-6 md:p-8">
              {/* Mobile: Stack vertically, Desktop: Grid */}
              <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
                {/* Product Info */}
                <div className="lg:col-span-2 order-2 lg:order-1">
                  {/* Badges - wrap properly */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="font-mono font-bold text-emerald-400 text-lg px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      {product.ticker}
                    </span>
                    {product.hasDividendBadge && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <Award className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs font-medium text-emerald-400">Trust Dividend</span>
                      </div>
                    )}
                    {product.status === "ipo" && (
                      <span className="px-2.5 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20 text-xs font-bold text-blue-400 uppercase">
                        IPS
                      </span>
                    )}
                    <span className="px-2.5 py-1 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-primary)] text-xs text-[var(--text-muted)]">
                      {product.category || "General"}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3 break-words">
                    {product.name}
                  </h1>

                  <p className="text-base text-[var(--text-secondary)] mb-5 leading-relaxed">
                    {product.description || "A premium product with exceptional market performance and strong community sentiment."}
                  </p>

                  {/* Stats - responsive grid */}
                  <div className="grid grid-cols-3 gap-3 sm:flex sm:flex-wrap sm:gap-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2 text-[var(--text-muted)]">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm font-medium text-center">{formatNumber(product.totalRatings || 0)} ratings</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2 text-[var(--text-muted)]">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm font-medium text-center">{product.dividendStreakDays || 0} day streak</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2 text-[var(--text-muted)]">
                      <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm font-medium">Global</span>
                    </div>
                  </div>
                </div>

                {/* Score Card - shows first on mobile */}
                <div className="lg:col-span-1 order-1 lg:order-2">
                  <div className={cn("p-5 rounded-xl border", getScoreBg(currentPrice))}>
                    <div className="text-center">
                      <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium">
                        Prodo Score
                      </span>
                      <div className={cn("text-5xl sm:text-6xl font-bold font-mono tabular-nums my-2", getScoreColor(currentPrice))}>
                        {currentPrice.toFixed(2)}
                      </div>
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold",
                        isPositive && "text-emerald-400 bg-emerald-500/10",
                        isNegative && "text-red-400 bg-red-500/10",
                        !isPositive && !isNegative && "text-[var(--text-muted)] bg-[var(--bg-tertiary)]"
                      )}>
                        {isPositive && <TrendingUp className="w-3.5 h-3.5" />}
                        {isNegative && <TrendingDown className="w-3.5 h-3.5" />}
                        <span>
                          {isPositive && "+"}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-[var(--border-primary)]">
                        <div className="flex items-center justify-center gap-1 text-sm">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "w-4 h-4",
                                star <= Math.round(currentPrice / 2)
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-[var(--text-muted)]"
                              )}
                            />
                          ))}
                          <span className="ml-2 text-[var(--text-muted)] text-xs">
                            {(currentPrice / 2).toFixed(1)} / 5
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Share Holding Banner (If owned) */}
        {userHoldings && userHoldings.quantity > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">You own {userHoldings.quantity} shares</p>
                <p className="text-xs text-emerald-400/70">Avg Cost: {parseFloat(userHoldings.avgPrice.toString()).toFixed(4)} credits</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-[var(--text-muted)] uppercase">Current Value</p>
                <p className="text-sm font-mono font-bold text-white">{(userHoldings.quantity * currentPrice).toFixed(2)} Credits</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--text-muted)] uppercase">Total P/L</p>
                <p className={cn(
                  "text-sm font-mono font-bold",
                  (userHoldings.quantity * currentPrice >= userHoldings.quantity * userHoldings.avgPrice) ? "text-emerald-400" : "text-red-400"
                )}>
                  {((userHoldings.quantity * currentPrice) - (userHoldings.quantity * userHoldings.avgPrice)).toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content - Responsive Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
          {/* Left Column - Charts & Breakdown */}
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
            {/* Price Chart */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 sm:p-6 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] light-border"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">Score History</h2>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)]">30-day performance trend</p>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                  {["1D", "1W", "1M", "3M", "1Y"].map((period) => (
                    <button
                      key={period}
                      className={cn(
                        "px-2.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap",
                        period === "1M"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                      )}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-48 sm:h-56 md:h-64 flex items-end gap-0.5 sm:gap-1 p-3 sm:p-4 bg-[var(--bg-tertiary)] rounded-xl overflow-hidden">
                {priceHistory.length > 0 ? priceHistory.map((point, i) => {
                  const price = parseFloat(point.price);
                  const height = ((price - 5) / 5) * 100;
                  const isLast = i === priceHistory.length - 1;
                  return (
                    <div key={i} className="flex-1 min-w-[3px] group relative h-full flex items-end">
                      <div
                        className={cn(
                          "w-full rounded-t-sm transition-all duration-300",
                          isLast
                            ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
                            : price >= 7.5
                            ? "bg-emerald-500/60 group-hover:bg-emerald-500"
                            : price >= 6
                            ? "bg-amber-500/60 group-hover:bg-amber-500"
                            : "bg-[var(--text-muted)]/30 group-hover:bg-[var(--text-muted)]"
                        )}
                        style={{ height: `${Math.max(10, height)}%` }}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {price.toFixed(2)}
                      </div>
                    </div>
                  );
                }) : (
                  <div className="flex-1 flex items-center justify-center text-[var(--text-muted)] text-sm">
                    No price history available
                  </div>
                )}
              </div>

              <div className="flex justify-between text-xs text-[var(--text-muted)] mt-2 px-2 sm:px-4">
                <span>30 days ago</span>
                <span>Today</span>
              </div>
            </motion.section>

            {/* Score Breakdown */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 sm:p-6 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] light-border"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">Score Breakdown</h2>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)]">Weighted indicator analysis</p>
                </div>
                <div className="flex items-center gap-1 text-xs sm:text-sm text-[var(--text-muted)]">
                  <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{formatNumber(product.totalRatings || 0)} ratings</span>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {[
                  { label: "Satisfaction", value: currentPrice * 0.95, weight: 25, color: "emerald" },
                  { label: "Quality", value: currentPrice * 0.92, weight: 25, color: "emerald" },
                  { label: "Feel", value: currentPrice * 0.88, weight: 20, color: "amber" },
                  { label: "Trendy", value: currentPrice * 0.94, weight: 15, color: "emerald" },
                  { label: "Speculation", value: currentPrice * 0.85, weight: 15, color: "amber" },
                ].map((indicator) => (
                  <div key={indicator.label} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-[var(--text-secondary)]">{indicator.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                          {indicator.value.toFixed(1)}
                        </span>
                        <span className="text-[10px] sm:text-xs text-[var(--text-muted)] w-8 text-right">
                          {indicator.weight}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 sm:h-2.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          indicator.color === "emerald" ? "bg-emerald-500" : "bg-amber-500"
                        )}
                        style={{ width: `${indicator.value * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Right Column - Rating Form */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:sticky lg:top-20"
            >
              <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] light-border">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-[var(--text-primary)] text-sm sm:text-base">Rate This Product</h2>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)]">Share your sentiment</p>
                  </div>
                </div>

                {submitted ? (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 border border-emerald-500/20">
                      <CheckCircle className="w-7 h-7 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                      Rating Submitted!
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] mb-4">
                      Your sentiment is now affecting the market score.
                    </p>

                    {/* Reveal Discount Code */}
                    {product.sentimentDiscountCode && (
                      <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-center gap-2 text-emerald-400 mb-2">
                          <Tag className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">Reward Unlocked</span>
                        </div>
                        <div className="text-2xl font-black text-white font-mono tracking-widest mb-1">
                          {product.sentimentDiscountCode}
                        </div>
                        <p className="text-[10px] text-emerald-400/70">
                          Use this code for your {product.sentimentDiscount} discount.
                        </p>
                      </div>
                    )}

                    <Button onClick={() => setSubmitted(false)} className="w-full" size="sm" variant="secondary">
                      Submit Another Rating
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Discount Offer (Visible before rating) */}
                    {product.sentimentDiscount && (
                      <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Tag className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-emerald-400 uppercase leading-none mb-1">
                            {product.sentimentDiscount} Discount
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)]">
                            Rate now to unlock your discount code.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Statement Input */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[var(--text-primary)] mb-1.5">
                        Your Statement
                      </label>
                      <Input
                        placeholder="Summarize in 10 words or less..."
                        value={statement}
                        onChange={(e) => setStatement(e.target.value)}
                        error={
                          statement && !statementValidation.valid
                            ? statementValidation.error
                            : undefined
                        }
                      />
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] sm:text-xs text-[var(--text-muted)]">
                          {statementValidation.wordCount}/10 words
                        </span>
                        {statementValidation.valid && statement && (
                          <span className="text-[10px] sm:text-xs text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Valid
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Indicator Sliders - Compact */}
                    <div className="space-y-3">
                      {indicators.map((ind) => {
                        const Icon = ind.icon;
                        return (
                          <div key={ind.key}>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-1.5">
                                <Icon className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                                <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                                  {ind.label}
                                </span>
                                <span className="text-[10px] text-[var(--text-muted)]">({ind.weight})</span>
                              </div>
                              <span className={cn(
                                "font-mono text-xs sm:text-sm font-bold min-w-[2rem] text-right",
                                ind.value >= 7 ? "text-emerald-400" : ind.value >= 5 ? "text-amber-400" : "text-red-400"
                              )}>
                                {ind.value.toFixed(1)}
                              </span>
                            </div>
                            <Slider
                              value={ind.value}
                              onChange={ind.setValue}
                              showLabel={false}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Preview Score */}
                    <div className={cn("p-3 rounded-xl border", getScoreBg(previewScore))}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-[var(--text-muted)]">Your Prodo Score</span>
                        <span className={cn("text-2xl sm:text-3xl font-bold font-mono tabular-nums", getScoreColor(previewScore))}>
                          {previewScore.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    {isAuthenticated ? (
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                        disabled={!statementValidation.valid || !statement}
                      >
                        Submit Rating
                      </Button>
                    ) : (
                      <Link href="/login" className="block">
                        <Button className="w-full" size="lg">
                          Sign In to Rate
                        </Button>
                      </Link>
                    )}

                    <p className="text-[10px] sm:text-xs text-center text-[var(--text-muted)]">
                      {isAuthenticated 
                        ? "Your rating will influence the product's Prodo Score"
                        : "Only authenticated consumers can submit ratings"}
                    </p>
                  </div>
                )}
              </div>

              {/* Share Purchase Panel (IPS Only) */}
              {(product.status === 'ipo' || product.status === 'active') && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 p-4 sm:p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 light-border relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                    <Rocket className="w-12 h-12 text-blue-400" />
                  </div>

                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-[var(--text-primary)] text-sm sm:text-base">Capital Market</h2>
                      <p className="text-xs sm:text-sm text-[var(--text-muted)]">Invest in {product.ticker} shares</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Share Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-primary)]">
                        <p className="text-[10px] text-[var(--text-muted)] uppercase mb-1">Total Supply</p>
                        <p className="text-sm font-mono font-bold text-white">{formatNumber(parseInt(product.totalShares || "0"))}</p>
                      </div>
                      <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-primary)]">
                        <p className="text-[10px] text-[var(--text-muted)] uppercase mb-1">Available</p>
                        <p className="text-sm font-mono font-bold text-blue-400">{formatNumber(parseInt(product.availableShares || "0"))}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-[var(--text-muted)]">Issuance Progress</span>
                        <span className="text-blue-400 font-bold">
                          {((1 - (parseFloat(product.availableShares || "0") / parseFloat(product.totalShares || "1"))) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                          style={{ width: `${(1 - (parseFloat(product.availableShares || "0") / parseFloat(product.totalShares || "1"))) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Buy Input */}
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-xs font-medium text-[var(--text-primary)] mb-1.5">
                          Quantity to Buy
                        </label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Amount..."
                            value={buyQuantity}
                            onChange={(e) => setBuyQuantity(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => setBuyQuantity(Math.floor(parseFloat(user?.siteCredits || "0") / currentPrice).toString())}
                            className="text-[10px] h-9"
                          >
                            MAX
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-primary)]">
                        <span className="text-xs text-[var(--text-muted)]">Total Cost</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-white font-mono">
                            {(parseFloat(buyQuantity || "0") * currentPrice).toFixed(2)}
                          </span>
                          <span className="text-[10px] text-blue-400 font-bold uppercase">Credits</span>
                        </div>
                      </div>

                      {buySuccess && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Purchase successful! Portfolio updated.
                        </div>
                      )}

                      {isAuthenticated ? (
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-500"
                          size="lg"
                          onClick={handleBuyShares}
                          isLoading={isBuying}
                          disabled={!buyQuantity || parseFloat(buyQuantity) <= 0 || (parseFloat(buyQuantity) * currentPrice > parseFloat(user?.siteCredits || "0"))}
                        >
                          Buy {product.ticker} Shares
                        </Button>
                      ) : (
                        <Link href="/login" className="block">
                          <Button className="w-full" size="lg">
                            Sign In to Invest
                          </Button>
                        </Link>
                      )}
                      
                      <p className="text-[10px] text-center text-[var(--text-muted)] mt-2">
                        You have <span className="text-blue-400 font-bold">{parseFloat(user?.siteCredits || "0").toFixed(2)}</span> available credits
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Actions - External Links */}
              <div className="mt-4 space-y-3">
                {product.purchaseUrl && (
                  <a 
                    href={product.purchaseUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="secondary" className="w-full flex items-center justify-center gap-2 border-emerald-500/20 hover:border-emerald-500/50">
                      <ShoppingBag className="w-4 h-4 text-emerald-400" />
                      Where to Buy
                    </Button>
                  </a>
                )}
                
                {product.externalPageUrl && (
                  <a 
                    href={product.externalPageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                      <Globe className="w-4 h-4" />
                      Official Website
                      <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-50" />
                    </Button>
                  </a>
                )}
              </div>

              {/* Quick Actions - Share/Social (Existing) */}
              <div className="mt-3 p-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] light-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)]">Share</span>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors cursor-pointer">
                      <Share2 className="w-4 h-4 text-[var(--text-muted)]" />
                    </button>
                    <button className="p-1.5 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors cursor-pointer">
                      <Globe className="w-4 h-4 text-[var(--text-muted)]" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
