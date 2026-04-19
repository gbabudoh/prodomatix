"use client";

import { useState } from "react";
import { Button } from "@/components/shared/button";
import { mockProducts } from "@/lib/mock-data";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Megaphone,
  Sparkles,
  Zap,
  TrendingUp,
  Eye,
  Clock,
  DollarSign,
  Check,
  Rocket,
  Target,
  BarChart3,
} from "lucide-react";

const campaignTypes = [
  {
    id: "hot_ips",
    name: "Hot IPS",
    description: "Pin your new product or service to the top of the ticker tape",
    price: 99,
    duration: "7 days",
    features: [
      "Top ticker placement",
      "HOT badge",
      "Priority in search",
      "~50K impressions",
    ],
    color: "from-orange-500 to-red-500",
    borderColor: "border-orange-500/30",
    bgColor: "bg-orange-500/5",
    icon: Zap,
  },
  {
    id: "market_alert",
    name: "Market Alert",
    description: "Send a notification to all users following your category",
    price: 199,
    duration: "24 hours",
    features: [
      "Push notification",
      "Email blast",
      "Featured banner",
      "~100K reach",
    ],
    color: "from-purple-500 to-pink-500",
    borderColor: "border-purple-500/30",
    bgColor: "bg-purple-500/5",
    icon: Megaphone,
  },
  {
    id: "trending",
    name: "Trending Boost",
    description: "Appear in the Top Movers section regardless of actual movement",
    price: 149,
    duration: "3 days",
    features: [
      "Top Movers placement",
      "Trending badge",
      "Homepage feature",
      "~75K impressions",
    ],
    color: "from-emerald-500 to-teal-500",
    borderColor: "border-emerald-500/30",
    bgColor: "bg-emerald-500/5",
    icon: TrendingUp,
  },
];

export default function AdFlowPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  const activeCampaigns = [
    {
      id: 1,
      product: mockProducts[2],
      type: "trending",
      impressions: 45230,
      endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-1 flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-amber-400" />
          </div>
          AdFLOW Billboard
        </h1>
        <p className="text-[var(--text-muted)]">
          Boost your products and services into the spotlight and drive more ratings.
        </p>
      </motion.div>

      {/* Active Campaigns */}
      {activeCampaigns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent overflow-hidden light-border">
            <div className="p-4 md:p-5 border-b border-[var(--border-primary)]">
              <h2 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Active Campaigns
              </h2>
            </div>
            <div className="p-4 md:p-5">
              <div className="space-y-4">
                {activeCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-primary)] light-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                        <TrendingUp className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-blue-400">
                            {campaign.product.ticker}
                          </span>
                          <span className="text-[var(--text-primary)] font-medium">
                            {campaign.product.name}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-muted)]">
                          Trending Boost Campaign
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 sm:gap-8">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Impressions</p>
                        <p className="text-[var(--text-primary)] font-medium flex items-center gap-1">
                          <Eye className="w-4 h-4 text-[var(--text-muted)]" />
                          {formatNumber(campaign.impressions)}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Ends in</p>
                        <p className="text-amber-400 font-medium flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          2 days
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Campaign Types */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Choose a Campaign Type
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {campaignTypes.map((campaign, index) => {
            const Icon = campaign.icon;
            const isSelected = selectedCampaign === campaign.id;

            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <div
                  className={cn(
                    "p-5 rounded-2xl border transition-all relative overflow-hidden cursor-pointer",
                    "bg-[var(--bg-secondary)]",
                    isSelected
                      ? "ring-2 ring-blue-500 border-blue-500"
                      : cn("hover:border-[var(--border-hover)]", campaign.borderColor),
                    "light-border"
                  )}
                  onClick={() => setSelectedCampaign(campaign.id)}
                >
                  {/* Gradient background */}
                  <div
                    className={cn(
                      "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 bg-gradient-to-br",
                      campaign.color
                    )}
                  />

                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={cn(
                          "p-3 rounded-xl bg-gradient-to-br",
                          campaign.color
                        )}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {isSelected && (
                        <div className="p-1.5 bg-blue-500 rounded-full">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                      {campaign.name}
                    </h3>
                    <p className="text-[var(--text-muted)] text-sm mb-4">
                      {campaign.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-4">
                      {campaign.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
                        >
                          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Price */}
                    <div className="flex items-end justify-between pt-4 border-t border-[var(--border-primary)]">
                      <div>
                        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Duration</p>
                        <p className="text-[var(--text-primary)] font-medium">
                          {campaign.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Price</p>
                        <p className="text-2xl font-bold text-[var(--text-primary)]">
                          {formatCurrency(campaign.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Product Selection & Launch */}
      {selectedCampaign && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] overflow-hidden light-border">
            <div className="p-4 md:p-5 border-b border-[var(--border-primary)]">
              <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <Rocket className="w-5 h-5 text-blue-400" />
                Launch Campaign
              </h3>
            </div>
            <div className="p-4 md:p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Selection */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Select Product
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 light-border"
                  >
                    <option value="">Choose a product...</option>
                    {mockProducts.slice(0, 3).map((product) => (
                      <option key={product.id} value={product.id.toString()}>
                        {product.ticker} - {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Summary */}
                <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 border border-[var(--border-primary)] light-border">
                  <h4 className="text-sm font-medium text-[var(--text-muted)] mb-3 uppercase tracking-wider">
                    Campaign Summary
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Campaign Type</span>
                      <span className="text-[var(--text-primary)] font-medium">
                        {
                          campaignTypes.find((c) => c.id === selectedCampaign)
                            ?.name
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Duration</span>
                      <span className="text-[var(--text-primary)] font-medium">
                        {
                          campaignTypes.find((c) => c.id === selectedCampaign)
                            ?.duration
                        }
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[var(--border-primary)]">
                      <span className="text-[var(--text-secondary)] font-medium">Total</span>
                      <span className="text-blue-400 font-bold text-lg">
                        {formatCurrency(
                          campaignTypes.find((c) => c.id === selectedCampaign)
                            ?.price || 0
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedCampaign(null)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!selectedProduct}
                  className="flex items-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  Launch Campaign
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-6">
        {[
          {
            label: "Total Spent",
            value: "$447",
            icon: DollarSign,
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/10",
            borderColor: "border-emerald-500/20",
          },
          {
            label: "Total Impressions",
            value: "125.4K",
            icon: Eye,
            color: "text-blue-400",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/20",
          },
          {
            label: "Campaigns Run",
            value: "3",
            icon: Target,
            color: "text-purple-400",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-500/20",
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className={cn(
                "p-4 md:p-5 rounded-2xl border bg-[var(--bg-secondary)] light-border",
                stat.borderColor
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-xl", stat.bgColor)}>
                    <Icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
                    <p className={cn("text-2xl font-bold", stat.color)}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
