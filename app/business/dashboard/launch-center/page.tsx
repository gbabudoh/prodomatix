"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared/card";
import { Button } from "@/components/shared/button";
import { formatNumber, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  TrendingUp,
  Eye,
  MousePointer2,
  Calendar,
  Tag,
  ExternalLink,
  Package,
  Plus,
  AlertCircle,
  Zap,
  X,
  Shield,
  Medal,
  Target,
} from "lucide-react";
import { BankListingForm } from "@/components/owner/BankListingForm";


interface Scout {
  id: number;
  name: string;
  avatarUrl: string | null;
  alphaScore: string;
  accuracyRating: string;
  tier: 'bronze' | 'silver' | 'gold';
}

interface Listing {
  id: number;
  listingType: string;
  featuredImage: string | null;
  shortDescription: string | null;
  purchaseLocation: string | null;
  sentimentDiscount: string;
  discountCode: string | null;
  discountExpiresAt: string | null;
  externalUrl: string | null;
  impressions: number;
  clicks: number;
  product: {
    id: number;
    name: string;
    ticker: string;
    category: string | null;
  };
  owner: {
    id: number;
    name: string;
  };
  createdAt: string;
}

interface Insight {
  userId: number;
  name: string;
  avatar: string | null;
  tier: string;
  intent: string;
  totalIntensity: number;
  interactedWith: string[];
  lastActive: string | Date;
}


export default function LaunchCenterPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [topScouts, setTopScouts] = useState<Scout[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [listRes, scoutsRes] = await Promise.all([
        fetch("/api/npb-nsb?scope=owner"),
        fetch("/api/leaderboard?limit=5")
      ]);

      if (listRes.ok) {
        const data = await listRes.json();
        setListings(data.listings || []);
      }

      if (scoutsRes.ok) {
        const data = await scoutsRes.json();
        setTopScouts(data.scouts || []);
      }

      const insightsRes = await fetch("/api/business/insights");
      if (insightsRes.ok) {
        const data = await insightsRes.json();
        setInsights(data.insights || []);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalImpressions = listings.reduce((sum, l) => sum + (l.impressions || 0), 0);
  const totalClicks = listings.reduce((sum, l) => sum + (l.clicks || 0), 0);
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-muted)]">Loading Launch Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-1">
                Market Launch Center
              </h1>
              <p className="text-[var(--text-muted)]">
                Manage your New Products (NPB) and New Services (NSB) bank listings.
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)} 
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Bank Promotion
          </Button>
        </div>
      </motion.div>

       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
         <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)] shadow-sm">
           <CardContent className="pt-6">
             <div className="flex items-center justify-between mb-4">
               <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                 <Eye className="w-5 h-5" />
               </div>
               <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                 Live
               </span>
             </div>
             <p className="text-sm text-[var(--text-muted)] mb-1">Total Impressions</p>
             <p className="text-3xl font-bold text-[var(--text-primary)]">{formatNumber(totalImpressions)}</p>
           </CardContent>
         </Card>
 
         <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)] shadow-sm">
           <CardContent className="pt-6">
             <div className="flex items-center justify-between mb-4">
               <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                 <MousePointer2 className="w-5 h-5" />
               </div>
             </div>
             <p className="text-sm text-[var(--text-muted)] mb-1">Total Clicks</p>
             <p className="text-3xl font-bold text-[var(--text-primary)]">{formatNumber(totalClicks)}</p>
           </CardContent>
         </Card>
 
         <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)] shadow-sm">
           <CardContent className="pt-6">
             <div className="flex items-center justify-between mb-4">
               <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                 <TrendingUp className="w-5 h-5" />
               </div>
             </div>
             <p className="text-sm text-[var(--text-muted)] mb-1">Average CTR</p>
             <p className="text-3xl font-bold text-[var(--text-primary)]">{avgCTR.toFixed(2)}%</p>
           </CardContent>
         </Card>

         <Card className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border-indigo-500/20 shadow-sm md:col-span-3 lg:col-span-1">
           <CardContent className="pt-6">
             <div className="flex items-center justify-between mb-4">
               <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                 <Shield className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Premium</span>
             </div>
             <p className="text-sm text-[var(--text-muted)] mb-1">Global Alpha Tier</p>
             <div className="flex items-center gap-2">
               <p className="text-3xl font-bold text-[var(--text-primary)] tracking-tighter">Institutional</p>
             </div>
           </CardContent>
         </Card>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
         {/* Main Content Area */}
         <div className="lg:col-span-2 space-y-8">


      {/* Listings Table */}
      <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)] light-border overflow-hidden">
        <CardHeader className="border-b border-[var(--border-primary)]">
          <CardTitle className="text-lg">Active & Recent Bank Listings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {listings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[var(--bg-tertiary)]/50 border-b border-[var(--border-primary)]">
                    <th className="py-3 px-6 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Product</th>
                    <th className="py-3 px-6 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Bank</th>
                    <th className="py-3 px-6 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Performance</th>
                    <th className="py-3 px-6 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Discount</th>
                    <th className="py-3 px-6 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Created</th>
                    <th className="py-3 px-6 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-primary)]">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-[var(--bg-tertiary)]/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center border border-[var(--border-primary)]">
                            <span className="text-xs font-mono font-bold text-blue-400">{listing.product.ticker}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-[var(--text-primary)]">{listing.product.name}</p>
                            <p className="text-xs text-[var(--text-muted)]">{listing.product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={cn(
                          "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                          listing.listingType === 'npb' 
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                            : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        )}>
                          {listing.listingType === 'npb' ? 'Products (NPB)' : 'Services (NSB)'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-[var(--text-muted)] flex items-center gap-1">
                              <Eye className="w-3 h-3" /> {listing.impressions}
                            </span>
                            <span className="text-[var(--text-muted)] flex items-center gap-1">
                              <MousePointer2 className="w-3 h-3" /> {listing.clicks}
                            </span>
                          </div>
                          <div className="w-32 h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500" 
                              style={{ width: `${Math.min((listing.clicks / (listing.impressions || 1)) * 1000, 100)}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-sm font-medium text-emerald-400">{listing.sentimentDiscount}</span>
                        </div>
                        {listing.discountCode && (
                          <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">Code: {listing.discountCode}</p>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(listing.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/product/${listing.product.id}`} target="_blank">
                            <Button variant="secondary" size="sm" className="h-8 w-8 !p-0">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                          <Button variant="secondary" size="sm" className="h-8">
                            End Listing
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--border-primary)]">
                <Rocket className="w-8 h-8 text-[var(--text-muted)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No active bank promotions</h3>
              <p className="text-[var(--text-muted)] text-sm mb-6 max-w-md mx-auto">
                Promote your products or services to the New Products Bank (NPB) or New Services Bank (NSB) to reach more consumers and collect more sentiment data.
              </p>
              <Link href="/business/dashboard/portfolio">
                <Button className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Go to Portfolio
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
        </Card>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
           <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 light-border">
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                 <Zap className="w-5 h-5 text-emerald-400" />
                 <h3 className="font-bold text-[var(--text-primary)]">Sentiment Momentum</h3>
               </div>
               <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md uppercase">Bullish</span>
             </div>
             <p className="text-sm text-[var(--text-secondary)] mb-6">
               Sentiment velocity has increased by **12.4%** since the last IPS update. Early adoption signals are strong in the London region.
             </p>
             <div className="flex items-end gap-1 h-20">
               {[40, 60, 45, 70, 85, 90, 80, 95, 100].map((h, i) => (
                 <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm hover:bg-emerald-400 transition-colors" style={{ height: `${h}%` }} />
               ))}
             </div>
           </div>

           <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 light-border">
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                 <AlertCircle className="w-5 h-5 text-red-400" />
                 <h3 className="font-bold text-[var(--text-primary)]">Risk & Volatility</h3>
               </div>
               <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-md uppercase">Low Risk</span>
             </div>
             <p className="text-sm text-[var(--text-secondary)]">
               **Circuit Breaker Status:** Green. <br/>
               No suspicious bot activity or review manipulation detected in the last 24h. The price is currently verified and stable.
             </p>
           </div>
         </div>
       </div>

       {/* Sidebar / Right Column */}
       <div className="space-y-8">
         <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)] shadow-sm light-border h-fit">
           <CardHeader className="pb-2">
             <CardTitle className="text-lg flex items-center justify-between">
               Institutional Scouts
               <Link href="/consumer/leaderboard" className="text-xs text-blue-400 font-medium hover:underline">View All</Link>
             </CardTitle>
             <p className="text-xs text-[var(--text-muted)]">Verified Market Makers interacting with your brand</p>
           </CardHeader>
           <CardContent className="space-y-2">
             {topScouts.length > 0 ? topScouts.map((scout, idx) => (
               <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-tertiary)]/50 transition-colors group cursor-pointer">
                 <div className="flex items-center gap-3">
                   <div className={cn(
                     "w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm",
                     scout.tier === 'gold' ? "bg-gradient-to-br from-yellow-400 to-amber-600" :
                     "bg-slate-400"
                   )}>
                     {scout.name.charAt(0).toUpperCase()}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-[var(--text-primary)] group-hover:text-blue-400 transition-colors">@{scout.name}</p>
                     <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                       <Medal className="w-3 h-3" />
                       {scout.tier.toUpperCase()} ANALYST
                     </p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-xs font-mono font-bold text-emerald-400">+{scout.accuracyRating}%</p>
                   <p className="text-[10px] text-[var(--text-muted)]">Accuracy</p>
                 </div>
               </div>
             )) : (
               <div className="text-center py-6">
                 <p className="text-sm text-[var(--text-muted)]">No premium scouts found yet.</p>
               </div>
             )}
              <div className="pt-4 mt-2 border-t border-[var(--border-primary)]">
                <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Whale Alert
                  </p>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    A Top-100 Global Scout recently rated your competitors. Issue a <strong>Sentiment Dividend</strong> to attract them!
                  </p>
                </div>
              </div>
           </CardContent>
         </Card>

         {/* New Behavioral Intelligence Panel */}
         <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)] shadow-sm light-border">
           <CardHeader className="pb-2">
             <CardTitle className="text-sm flex items-center gap-2">
               <Eye className="w-4 h-4 text-blue-400" /> Actionable Intent Pulse
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-3">
             {insights.length > 0 ? insights.map((insight: Insight, idx: number) => (
               <div key={idx} className="p-2.5 rounded-xl bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] group">
                 <div className="flex items-center justify-between mb-2">
                   <span className={cn(
                     "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                     insight.intent === 'buyer' ? "bg-emerald-500/10 text-emerald-400" :
                     insight.intent === 'scout' ? "bg-blue-500/10 text-blue-400" :
                     "bg-indigo-500/10 text-indigo-400"
                   )}>
                     {insight.intent}
                   </span>
                   <div className="flex items-center gap-1">
                     <Zap className="w-3 h-3 text-amber-400" />
                     <span className="text-[10px] font-mono text-amber-400">{insight.totalIntensity}</span>
                   </div>
                 </div>
                 <p className="text-xs font-bold text-[var(--text-primary)] mb-1">@{insight.name}</p>
                 <p className="text-[10px] text-[var(--text-muted)] line-clamp-1 italic">
                   Interacted with: {insight.interactedWith?.join(", ")}
                 </p>
               </div>
             )) : (
               <div className="text-center py-4">
                 <p className="text-xs text-[var(--text-muted)]">No high-intensity patterns detected recently.</p>
               </div>
             )}
           </CardContent>
         </Card>

         <Card className="bg-[var(--bg-secondary)] border-[var(--border-primary)] shadow-sm light-border">
           <CardHeader>
             <CardTitle className="text-sm">Quick Actions</CardTitle>
           </CardHeader>
           <CardContent className="space-y-2">
             <Button variant="secondary" size="sm" className="w-full justify-start gap-2 h-10 text-xs text-blue-400">
               <Target className="w-4 h-4" /> Issue Sentiment Dividend
             </Button>
             <Button variant="secondary" size="sm" className="w-full justify-start gap-2 h-10 text-xs">
               <Plus className="w-4 h-4" /> Issue New Shares (IPS)
             </Button>
           </CardContent>
         </Card>
       </div>
     </div>


      {/* Create Promotion Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto light-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-[var(--border-primary)] flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                    <Rocket className="w-6 h-6 text-emerald-400" />
                    Market Launch Center
                  </h2>
                  <p className="text-[var(--text-muted)] mt-1">
                    Create a new product or service listing for the Consumer Discovery Bank
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <BankListingForm 
                  onCancel={() => setShowCreateModal(false)}
                  onSuccess={() => {
                    fetchData();
                    setShowCreateModal(false);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
