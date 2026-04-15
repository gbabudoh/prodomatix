"use client";

import { use, useState, useMemo } from "react";
import { useMarketStore } from "@/store/market-store";
import { mockProducts, mockPriceHistory } from "@/lib/mock-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared/card";
import { Button } from "@/components/shared/button";
import { Slider } from "@/components/shared/slider";
import { Input } from "@/components/shared/input";
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
} from "lucide-react";

interface PageProps {
  params: Promise<{ productId: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const { productId } = use(params);
  const { addStatement, updateProductPrice } = useMarketStore();

  // Find product (using mock data for now)
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

  // Validate statement
  const statementValidation = validateTenWordStatement(statement);

  // Calculate preview score
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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Product not found
          </h1>
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

  const handleSubmit = async () => {
    if (!statementValidation.valid) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Add to live feed
    addStatement({
      id: Date.now(),
      productTicker: product.ticker,
      productName: product.name,
      statement,
      score: previewScore,
      countryCode: "US", // Would come from user's location
      createdAt: new Date(),
    });

    // Update product price (simplified)
    const newPrice = (currentPrice * 0.9 + previewScore * 0.1).toFixed(2);
    const change = (parseFloat(newPrice) - currentPrice).toFixed(2);
    updateProductPrice(product.id, newPrice, change);

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Market
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card variant="gradient" className="relative overflow-hidden">
                {product.isAdflowPromoted && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400 text-xs font-medium">
                      Promoted
                    </span>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono font-bold text-emerald-400 text-xl">
                        {product.ticker}
                      </span>
                      {product.hasDividendBadge && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 rounded-full">
                          <Award className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 text-xs font-medium">
                            Dividend
                          </span>
                        </div>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {product.name}
                    </h1>
                    <p className="text-gray-400">{product.description}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <span className="text-sm text-gray-500">
                        {product.category}
                      </span>
                      <span className="text-gray-700">•</span>
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        {formatNumber(product.totalRatings || 0)} ratings
                      </span>
                    </div>
                  </div>

                  {/* Price Display */}
                  <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Prodo Score</div>
                    <div className="text-5xl font-bold text-white font-mono">
                      {currentPrice.toFixed(2)}
                    </div>
                    <div
                      className={cn(
                        "flex items-center justify-end gap-2 text-lg font-medium mt-2",
                        isPositive && "text-emerald-400",
                        isNegative && "text-red-400",
                        !isPositive && !isNegative && "text-gray-500"
                      )}
                    >
                      {isPositive && <TrendingUp className="w-5 h-5" />}
                      {isNegative && <TrendingDown className="w-5 h-5" />}
                      <span>
                        {isPositive && "+"}
                        {priceChange.toFixed(2)} ({priceChangePercent.toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-800">
                  <Button variant="secondary" className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Follow
                  </Button>
                  <Button variant="secondary" className="flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button variant="secondary" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Global View
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Price Chart Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Prodo Score History (30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end gap-1">
                    {priceHistory.map((point, i) => {
                      const height =
                        ((point.price - 6) / 4) * 100; // Normalize to 0-100%
                      const isLast = i === priceHistory.length - 1;
                      return (
                        <div
                          key={i}
                          className={cn(
                            "flex-1 rounded-t transition-all",
                            isLast
                              ? "bg-emerald-500"
                              : point.price >= 7.5
                              ? "bg-emerald-500/50"
                              : "bg-gray-700"
                          )}
                          style={{ height: `${Math.max(10, height)}%` }}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>30 days ago</span>
                    <span>Today</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Rating Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-4"
            >
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-400" />
                    Rate This Product
                  </CardTitle>
                </CardHeader>

                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Rating Submitted!
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Your sentiment has been recorded and is now affecting the
                      market.
                    </p>
                    <Button onClick={() => setSubmitted(false)}>
                      Rate Again
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* 10-Word Statement */}
                    <div>
                      <Input
                        label="Your 10-Word Statement"
                        placeholder="Summarize your experience in 10 words or less..."
                        value={statement}
                        onChange={(e) => setStatement(e.target.value)}
                        error={
                          statement && !statementValidation.valid
                            ? statementValidation.error
                            : undefined
                        }
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {statementValidation.wordCount}/10 words
                      </p>
                    </div>

                    {/* Indicator Sliders */}
                    <div className="space-y-4">
                      <Slider
                        label="Satisfaction"
                        value={satisfaction}
                        onChange={setSatisfaction}
                      />
                      <Slider
                        label="Quality"
                        value={quality}
                        onChange={setQuality}
                      />
                      <Slider
                        label="Feel"
                        value={feel}
                        onChange={setFeel}
                      />
                      <Slider
                        label="Trendy"
                        value={trendy}
                        onChange={setTrendy}
                      />
                      <Slider
                        label="Speculation"
                        value={speculation}
                        onChange={setSpeculation}
                      />
                    </div>

                    {/* Preview Score */}
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Your Prodo Score</span>
                        <span
                          className={cn(
                            "text-2xl font-bold font-mono",
                            previewScore >= 8
                              ? "text-emerald-400"
                              : previewScore >= 6
                              ? "text-yellow-400"
                              : previewScore >= 4
                              ? "text-orange-400"
                              : "text-red-400"
                          )}
                        >
                          {previewScore.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleSubmit}
                      isLoading={isSubmitting}
                      disabled={!statementValidation.valid || !statement}
                    >
                      Submit Prodo Rating
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Your rating will affect the product&apos;s Prodo Score
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
