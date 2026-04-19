"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  Zap, 
  Award, 
  Medal, 
  Star,
  ChevronRight,
  User,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Scout {
  id: number;
  name: string;
  avatarUrl: string | null;
  alphaScore: string;
  accuracyRating: string;
  tier: 'bronze' | 'silver' | 'gold';
}

export default function LeaderboardPage() {
  const [scouts, setScouts] = useState<Scout[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all-time');

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const res = await fetch("/api/leaderboard?limit=20");
        if (res.ok) {
          const data = await res.json();
          setScouts(data.scouts || []);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <div className="p-6 md:p-8 pb-32 md:pb-8 max-w-[1200px] mx-auto min-h-screen">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-full border border-yellow-500/20 text-yellow-500 text-xs font-bold uppercase tracking-widest mb-4">
          <Trophy className="w-3.5 h-3.5" />
          Prodomatix Scout Rankings
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--text-primary)] mb-4 tracking-tight">
          Sentiment <span className="text-yellow-500">Hall of Fame</span>
        </h1>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
          The top 1% of analysts who identified market-moving trends before the crowd. 
          Ranked by <span className="text-[var(--text-primary)] font-bold">Alpha Score (ROI + Accuracy)</span>.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {[
          { id: 'all-time', label: 'All-Time', icon: Award },
          { id: 'weekly', label: 'Rising Stars', icon: TrendingUp },
          { id: 'sector', label: 'Sector Experts', icon: Target },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all border",
                activeTab === tab.id
                  ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-transparent shadow-xl shadow-white/5 scale-105"
                  : "bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-primary)] hover:border-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Leaderboard Table/List */}
      <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-primary)] shadow-2xl overflow-hidden light-border">
        {loading ? (
          <div className="py-24 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
            <p className="text-[var(--text-muted)] font-medium">Calculating Alpha rankings...</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-primary)]">
            {scouts.map((scout, idx) => {
              const rank = idx + 1;
              const isTop3 = rank <= 3;
              
              return (
                <motion.div
                  key={scout.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "flex items-center gap-4 p-5 md:p-6 hover:bg-[var(--bg-tertiary)]/50 transition-colors group",
                    isTop3 ? "bg-yellow-500/5" : ""
                  )}
                >
                  {/* Rank */}
                  <div className="w-10 flex items-center justify-center">
                    {rank === 1 ? <Medal className="w-8 h-8 text-yellow-400" /> :
                     rank === 2 ? <Medal className="w-7 h-7 text-gray-400" /> :
                     rank === 3 ? <Medal className="w-6 h-6 text-amber-600" /> :
                     <span className="text-xl font-mono font-bold text-[var(--text-muted)]">{rank}</span>}
                  </div>

                  {/* Profile */}
                  <div className="flex-1 flex items-center gap-4 min-w-0">
                    <div className={cn(
                      "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-105",
                      scout.tier === 'gold' ? "bg-gradient-to-br from-yellow-400 to-amber-600 border-yellow-500/30" :
                      scout.tier === 'silver' ? "bg-gradient-to-br from-slate-300 to-slate-500 border-slate-400/30" :
                      "bg-[var(--bg-tertiary)] border-[var(--border-primary)]"
                    )}>
                      {scout.avatarUrl ? (
                        <Image 
                          src={scout.avatarUrl} 
                          alt={`${scout.name} avatar`} 
                          width={56}
                          height={56}
                          unoptimized
                          className="w-full h-full rounded-2xl object-cover" 
                        />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--text-primary)] text-lg truncate">@{scout.name}</span>
                        {scout.tier === 'gold' && <Zap className="w-4 h-4 text-yellow-500 fill-current" />}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] font-medium">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full border shadow-sm uppercase tracking-tighter",
                          scout.tier === 'gold' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" :
                          scout.tier === 'silver' ? "bg-slate-500/10 border-slate-500/20 text-slate-400" :
                          "bg-[var(--bg-tertiary)] border-[var(--border-primary)] text-[var(--text-muted)]"
                        )}>
                          {scout.tier} Scout
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {parseFloat(scout.accuracyRating).toFixed(0)}% Accuracy
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Alpha Score */}
                  <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-2xl font-black text-[var(--text-primary)] font-mono tracking-tighter">
                        {parseFloat(scout.alphaScore).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[10px] text-yellow-500/70 font-bold uppercase tracking-widest">
                      Alpha Score
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20">
          <Activity className="w-8 h-8 text-blue-400 mb-4" />
          <h3 className="font-bold text-[var(--text-primary)] mb-2">Alpha Logic</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Alpha isn&apos;t points—it&apos;s ROI. You earn more by rating products before they go viral.
          </p>
        </div>
        <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20">
          <ArrowUpRight className="w-8 h-8 text-emerald-400 mb-4" />
          <h3 className="font-bold text-[var(--text-primary)] mb-2">Scout Multipliers</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Gold scouts have 3x voting weight. The community trusts your &quot;eye&quot; for quality.
          </p>
        </div>
        <div className="p-6 rounded-3xl bg-yellow-500/5 border border-yellow-500/20">
          <Star className="w-8 h-8 text-yellow-500 mb-4" />
          <h3 className="font-bold text-[var(--text-primary)] mb-2">Weekly Dividends</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            The top 10 Rising Stars earn a performance fee distributed by participating brands.
          </p>
        </div>
      </div>
    </div>
  );
}
