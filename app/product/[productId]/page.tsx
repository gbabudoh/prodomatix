"use client";

import { use, useState, useMemo } from "react";
import { useMarketStore } from "@/store/market-store";
import { useAuthStore } from "@/store/auth-store";
import { mockProducts, mockPriceHistory } from "@/lib/mock-data";
import { Button } from "@/components/shared/button";
import { Slider } from "@/components/shared/slider";
import { Input } from "@/components/shared/input";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { validateTenWordStatement, formatNumber } from "@/lib/utils";
import { calculateWeightedScore } from "@/lib/calculate-score";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  Share2,
  Heart,
  MessageSquare,
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
} from "lucide-react";

interface PageProps {
  params: Promise<{ productId: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const { productId } = use(params);
  const { addStatement, updateProductPrice } = useMarketStore();
  const { isAuthenticated } = useAuthStore();

  const product = mockProducts.find((p) => p.id === parseInt(productId));
  const priceHistory = mockPriceHistory[product?.ticker || ""] || [];

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

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center">
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
    await new Promise((resolve) => setTimeout(resolve, 1000));

    addStatement({
      id: Date.now(),
      productTicker: product.ticker,
      productName: product.name,
      statement,
      score: previewScore,
      countryCode: "US",
      createdAt: new Date(),
    });

    const newPrice = (currentPrice * 0.9 + previewScore * 0.1).toFixed(2);
    const change = (parseFloat(newPrice) - currentPrice).toFixed(2);
    updateProductPrice(product.id, newPrice, change);

    setIsSubmitting(false);
    setSubmitted(true);
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
      <header className="sticky top-0 z-50 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Back to Market</span>
              </Link>
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Product Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            {/* Promoted Badge */}
            {product.isAdflowPromoted && (
              <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg shadow-amber-500/30">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm font-bold text-white">Featured</span>
              </div>
            )}

            <div className="relative p-8 md:p-10">
              <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Left: Product Info */}
                <div className="lg:col-span-2">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="font-mono font-bold text-emerald-400 text-xl px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      {product.ticker}
                    </span>
                    {product.hasDividendBadge && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <Award className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-400">Trust Dividend</span>
                      </div>
                    )}
                    {product.status === "ipo" && (
                      <span className="px-3 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20 text-sm font-bold text-blue-400 uppercase">
                        IPO
                      </span>
                    )}
                    <span className="px-3 py-1.5 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-primary)] text-sm text-[var(--text-muted)]">
                      {product.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">
                    {product.name}
                  </h1>

                  {/* Description */}
                  <p className="text-lg text-[var(--text-secondary)] mb-6 max-w-2xl leading-relaxed">
                    {product.description || "A premium product with exceptional market performance and strong community sentiment."}
                  </p>

                  {/* Stats Row */}
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      <Users className="w-5 h-5" />
                      <span className="font-medium">{formatNumber(product.totalRatings || 0)} ratings</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">Listed 45 days ago</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      <Globe className="w-5 h-5" />
                      <span className="font-medium">12 countries</span>
                    </div>
                  </div>
                </div>

                {/* Right: Score Card */}
                <div className="lg:col-span-1">
                  <div className={cn(
                    "p-6 rounded-2xl border backdrop-blur-sm",
                    getScoreBg(currentPrice)
                  )}>
                    <div className="text-center">
                      <span className="text-sm text-[var(--text-muted)] uppercase tracking-wider font-medium">
                        Prodo Score
                      </span>
                      <div className={cn(
                        "text-6xl font-bold font-mono tabular-nums my-3",
                        getScoreColor(currentPrice)
                      )}>
                        {currentPrice.toFixed(2)}
                      </div>
                      <div className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold",
                        isPositive && "text-emerald-400 bg-emerald-500/10",
                        isNegative && "text-red-400 bg-red-500/10",
                        !isPositive && !isNegative && "text-[var(--text-muted)] bg-[var(--bg-tertiary)]"
                      )}>
                        {isPositive && <TrendingUp className="w-4 h-4" />}
                        {isNegative && <TrendingDown className="w-4 h-4" />}
                        <span>
                          {isPositive && "+"}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-[var(--border-primary)]">
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
                          <span className="ml-2 text-[var(--text-muted)]">
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

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price Chart */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">Score History</h2>
                  <p className="text-sm text-[var(--text-muted)]">30-day performance trend</p>
                </div>
                <div className="flex items-center gap-2">
                  {["1D", "1W", "1M", "3M", "1Y"].map((period) => (
                    <button
                      key={period}
                      className={cn(
                        "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer",
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

              {/* Chart */}
              <div className="h-64 flex items-end gap-1 p-4 bg-[var(--bg-tertiary)] rounded-xl">
                {priceHistory.map((point, i) => {
                  const height = ((point.price - 5) / 5) * 100;
                  const isLast = i === priceHistory.length - 1;
                  return (
                    <div
                      key={i}
                      className="flex-1 group relative"
                    >
                      <div
                        className={cn(
                          "w-full rounded-t-sm transition-all duration-300",
                          isLast
                            ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
                            : point.price >= 7.5
                            ? "bg-emerald-500/60 group-hover:bg-emerald-500"
                            : point.price >= 6
                            ? "bg-amber-500/60 group-hover:bg-amber-500"
                            : "bg-[var(--text-muted)]/30 group-hover:bg-[var(--text-muted)]"
                        )}
                        style={{ height: `${Math.max(10, height)}%` }}
                      />
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {point.price.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between text-xs text-[var(--text-muted)] mt-3 px-4">
                <span>30 days ago</span>
                <span>Today</span>
              </div>
            </motion.section>

            {/* Score Breakdown */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">Score Breakdown</h2>
                  <p className="text-sm text-[var(--text-muted)]">Weighted indicator analysis</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-[var(--text-muted)]">
                  <Info className="w-4 h-4" />
                  <span>Based on {formatNumber(product.totalRatings || 0)} ratings</span>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Satisfaction", value: 8.2, weight: 25, color: "emerald" },
                  { label: "Quality", value: 7.8, weight: 25, color: "emerald" },
                  { label: "Feel", value: 7.5, weight: 20, color: "amber" },
                  { label: "Trendy", value: 8.0, weight: 15, color: "emerald" },
                  { label: "Speculation", value: 7.2, weight: 15, color: "amber" },
                ].map((indicator) => (
                  <div key={indicator.label} className="flex items-center gap-4">
                    <div className="w-28 text-sm text-[var(--text-secondary)]">{indicator.label}</div>
                    <div className="flex-1 h-3 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          indicator.color === "emerald" ? "bg-emerald-500" : "bg-amber-500"
                        )}
                        style={{ width: `${indicator.value * 10}%` }}
                      />
                    </div>
                    <div className="w-12 text-right font-mono text-sm font-medium text-[var(--text-primary)]">
                      {indicator.value.toFixed(1)}
                    </div>
                    <div className="w-12 text-right text-xs text-[var(--text-muted)]">
                      {indicator.weight}%
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Right Column - Rating Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24"
            >
              <div className="p-6 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <Target className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-[var(--text-primary)]">Rate This Product</h2>
                    <p className="text-sm text-[var(--text-muted)]">Share your sentiment</p>
                  </div>
                </div>

                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                      Rating Submitted!
                    </h3>
                    <p className="text-[var(--text-muted)] mb-6">
                      Your sentiment is now affecting the market score.
                    </p>
                    <Button onClick={() => setSubmitted(false)} className="w-full">
                      Submit Another Rating
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Statement Input */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
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
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-[var(--text-muted)]">
                          {statementValidation.wordCount}/10 words
                        </span>
                        {statementValidation.valid && statement && (
                          <span className="text-xs text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Valid
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Indicator Sliders */}
                    <div className="space-y-5">
                      {indicators.map((ind) => {
                        const Icon = ind.icon;
                        return (
                          <div key={ind.key}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4 text-[var(--text-muted)]" />
                                <span className="text-sm font-medium text-[var(--text-primary)]">
                                  {ind.label}
                                </span>
                                <span className="text-xs text-[var(--text-muted)]">({ind.weight})</span>
                              </div>
                              <span className={cn(
                                "font-mono text-sm font-bold",
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
                    <div className={cn(
                      "p-4 rounded-xl border",
                      getScoreBg(previewScore)
                    )}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--text-muted)]">Your Prodo Score</span>
                        <span className={cn(
                          "text-3xl font-bold font-mono tabular-nums",
                          getScoreColor(previewScore)
                        )}>
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

                    <p className="text-xs text-center text-[var(--text-muted)]">
                      Your rating will influence the product&apos;s Prodo Score
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-4 p-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">View on</span>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors cursor-pointer">
                      <Globe className="w-4 h-4 text-[var(--text-muted)]" />
                    </button>
                    <button className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors cursor-pointer">
                      <ExternalLink className="w-4 h-4 text-[var(--text-muted)]" />
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
