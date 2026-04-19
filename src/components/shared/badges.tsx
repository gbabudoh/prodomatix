"use client";

import { cn } from "@/lib/utils";
import { Award, Sparkles, TrendingUp, Zap, Shield } from "lucide-react";

interface BadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function DividendBadge({ className, size = "md" }: BadgeProps) {
  const sizes = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-full font-medium text-emerald-400",
        sizes[size],
        className
      )}
    >
      <Award className={iconSizes[size]} />
      <span>Trust Dividend</span>
    </div>
  );
}

export function PromotedBadge({ className, size = "md" }: BadgeProps) {
  const sizes = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full font-medium text-yellow-400",
        sizes[size],
        className
      )}
    >
      <Sparkles className={iconSizes[size]} />
      <span>AdFlow</span>
    </div>
  );
}

export function IPSBadge({ className, size = "md" }: BadgeProps) {
  const sizes = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-full font-medium text-blue-400",
        sizes[size],
        className
      )}
    >
      <Zap className={iconSizes[size]} />
      <span>Hot IPS</span>
    </div>
  );
}

export function TrendingBadge({ className, size = "md" }: BadgeProps) {
  const sizes = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full font-medium text-purple-400",
        sizes[size],
        className
      )}
    >
      <TrendingUp className={iconSizes[size]} />
      <span>Trending</span>
    </div>
  );
}

export function VerifiedBadge({ className, size = "md" }: BadgeProps) {
  const sizes = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full font-medium text-cyan-400",
        sizes[size],
        className
      )}
    >
      <Shield className={iconSizes[size]} />
      <span>Verified</span>
    </div>
  );
}

// Score-based sentiment badge
export function SentimentBadge({
  score,
  className,
  size = "md",
}: BadgeProps & { score: number }) {
  const sentiment =
    score >= 8 ? "Bullish" : score >= 6 ? "Neutral" : "Bearish";
  const colors = {
    Bullish: "from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400",
    Neutral: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-400",
    Bearish: "from-red-500/20 to-orange-500/20 border-red-500/30 text-red-400",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center bg-gradient-to-r border rounded-full font-medium",
        colors[sentiment],
        sizes[size],
        className
      )}
    >
      {sentiment}
    </div>
  );
}
