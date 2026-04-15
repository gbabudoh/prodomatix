"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared/card";
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
  Plus,
  Check,
} from "lucide-react";

const campaignTypes = [
  {
    id: "hot_ipo",
    name: "Hot IPO",
    description: "Pin your new product to the top of the ticker tape",
    price: 99,
    duration: "7 days",
    features: [
      "Top ticker placement",
      "HOT badge",
      "Priority in search",
      "~50K impressions",
    ],
    color: "from-orange-500 to-red-500",
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
    icon: TrendingUp,
  },
];

export default function AdFlowPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  // Active campaigns (mock)
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
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          AdFLOW Billboard
        </h1>
        <p className="text-gray-400">
          Boost your products into the spotlight and drive more ratings.
        </p>
      </div>

      {/* Active Campaigns */}
      {activeCampaigns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Zap className="w-5 h-5" />
                Active Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-400">
                            {campaign.product.ticker}
                          </span>
                          <span className="text-white font-medium">
                            {campaign.product.name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Trending Boost Campaign
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Impressions</p>
                        <p className="text-white font-medium flex items-center gap-1">
                          <Eye className="w-4 h-4 text-gray-500" />
                          {formatNumber(campaign.impressions)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Ends in</p>
                        <p className="text-yellow-400 font-medium flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          2 days
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Campaign Types */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Choose a Campaign Type
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campaignTypes.map((campaign, index) => {
            const Icon = campaign.icon;
            const isSelected = selectedCampaign === campaign.id;

            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={cn(
                    "transition-all relative overflow-hidden cursor-pointer",
                    isSelected
                      ? "ring-2 ring-emerald-500 border-emerald-500"
                      : "hover:border-gray-600"
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
                          "p-3 rounded-lg bg-gradient-to-br",
                          campaign.color
                        )}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {isSelected && (
                        <div className="p-1 bg-emerald-500 rounded-full">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-2">
                      {campaign.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {campaign.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-4">
                      {campaign.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm text-gray-300"
                        >
                          <Check className="w-4 h-4 text-emerald-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Price */}
                    <div className="flex items-end justify-between pt-4 border-t border-gray-800">
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="text-white font-medium">
                          {campaign.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-2xl font-bold text-white">
                          {formatCurrency(campaign.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
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
          <Card>
            <CardHeader>
              <CardTitle>Launch Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Product
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">
                    Campaign Summary
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Campaign Type</span>
                      <span className="text-white">
                        {
                          campaignTypes.find((c) => c.id === selectedCampaign)
                            ?.name
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration</span>
                      <span className="text-white">
                        {
                          campaignTypes.find((c) => c.id === selectedCampaign)
                            ?.duration
                        }
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-700">
                      <span className="text-gray-400 font-medium">Total</span>
                      <span className="text-emerald-400 font-bold text-lg">
                        {formatCurrency(
                          campaignTypes.find((c) => c.id === selectedCampaign)
                            ?.price || 0
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
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
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {[
          {
            label: "Total Spent",
            value: "$447",
            icon: DollarSign,
            color: "text-emerald-400",
          },
          {
            label: "Total Impressions",
            value: "125.4K",
            icon: Eye,
            color: "text-blue-400",
          },
          {
            label: "Campaigns Run",
            value: "3",
            icon: Megaphone,
            color: "text-purple-400",
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
              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <Icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className={cn("text-2xl font-bold", stat.color)}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
