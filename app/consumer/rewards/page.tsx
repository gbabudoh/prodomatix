"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, 
  Zap, 
  ArrowUpRight, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  AlertCircle,
  Gem,
  Award,
  TrendingUp,
  RefreshCw,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

interface DividendHistory {
  id: number;
  alphaAmount: string;
  creditAmount: string;
  claimedAt: string;
}

interface WalletData {
  tier: string;
  alphaScore: string;
  claimableAlpha: string;
  siteCredits: string;
  conversionRate: number;
  isEligible: boolean;
}

export default function RewardsPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<WalletData | null>(null);
  const [history, setHistory] = useState<DividendHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/consumer/dividends");
      if (res.ok) {
        const json = await res.json();
        setData(json.wallet);
        setHistory(json.history);
      }
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClaim = async () => {
    if (!data?.isEligible) return;
    setClaiming(true);
    setMessage(null);

    try {
      const res = await fetch("/api/consumer/dividends/claim", { method: "POST" });
      const json = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: `Success! You earned ${json.creditsEarned} site credits.` });
        fetchData();
      } else {
        setMessage({ type: 'error', text: json.error || "Claim failed" });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "Connection error. Payout failed." });
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
        <p className="text-[var(--text-muted)]">Connecting to Alpha Wallet...</p>
      </div>
    );
  }

  const alphaToConvert = parseFloat(data?.claimableAlpha || '0');
  const estimatedCredits = alphaToConvert * (data?.conversionRate || 0.1);

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto pb-32">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <Gem className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Alpha Wallet</h1>
        </div>
        <p className="text-[var(--text-secondary)]">Manage your Scout ROI and conversion history.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Balance Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] rounded-3xl border border-[var(--border-primary)] p-8 shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Wallet className="w-48 h-48" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <span className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Scout Balance
              </span>
              <div className={cn(
                "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter shadow-inner",
                data?.tier === 'gold' ? "bg-yellow-400 text-black shadow-yellow-500/20" :
                data?.tier === 'silver' ? "bg-slate-300 text-black shadow-slate-400/20" :
                "bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border-primary)]"
              )}>
                {data?.tier} Status
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <span className="text-sm font-medium text-[var(--text-muted)] mb-2 block">Current Site Credits</span>
                <div className="flex items-center gap-4">
                  <div className="text-6xl font-black text-[var(--text-primary)] font-mono tracking-tighter">
                    {parseFloat(data?.siteCredits || '0').toFixed(2)}
                  </div>
                  <span className="text-emerald-400 font-black text-xl">CREDITS</span>
                </div>
              </div>
              
              <div className="flex-1 max-w-sm">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-3 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
                    <span>Claimable Alpha</span>
                    <span className="text-emerald-400">{alphaToConvert.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (alphaToConvert / 5000) * 100)}%` }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] text-right">
                    ≈ {estimatedCredits.toFixed(2)} Credits
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "p-6 rounded-3xl border transition-all h-full flex flex-col justify-between",
              data?.isEligible 
                ? "bg-emerald-500/5 border-emerald-500/20 shadow-emerald-500/5" 
                : "bg-yellow-500/5 border-yellow-500/20"
            )}
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  data?.isEligible ? "bg-emerald-500/20" : "bg-yellow-500/20"
                )}>
                  {data?.isEligible ? <Award className="w-6 h-6 text-emerald-400" /> : <TrendingUp className="w-6 h-6 text-yellow-400" />}
                </div>
                <h3 className="font-bold text-[var(--text-primary)]">
                  {data?.isEligible ? "Ready for Payout" : "Scout Milestone"}
                </h3>
              </div>
              
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                {data?.isEligible 
                  ? "Your Gold status enables Alpha-to-Credit conversion. Site credits can be used for platform benefits or product discounts."
                  : "Only Gold Scouts (5,000+ Alpha) can claim dividends. Continue rating products to unlock financial ROI."
                }
              </p>

              {message && (
                <div className={cn(
                  "p-4 rounded-xl text-sm font-medium mb-6 flex items-start gap-3",
                  message.type === 'success' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                )}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {message.text}
                </div>
              )}
            </div>

            <button
              onClick={handleClaim}
              disabled={claiming || !data?.isEligible || alphaToConvert <= 0}
              className={cn(
                "w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2",
                data?.isEligible && alphaToConvert > 0
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 hover:scale-[1.02]"
                  : "bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border-primary)] cursor-not-allowed opacity-50"
              )}
            >
              {claiming ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {claiming ? "Processing..." : "Claim Dividends"}
            </button>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tier Info */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Tier Benefits</h2>
          </div>
          <div className="space-y-3">
            {[
              { tier: 'Bronze', roi: '1:1 Exposure', active: data?.tier === 'bronze' },
              { tier: 'Silver', roi: '1.5x Multiplier', active: data?.tier === 'silver' },
              { tier: 'Gold', roi: '3x Multiplier + Dividends', active: data?.tier === 'gold' },
            ].map((item) => (
              <div 
                key={item.tier}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border transition-all",
                  item.active 
                    ? "bg-[var(--bg-tertiary)] border-emerald-500/30 shadow-lg" 
                    : "bg-[var(--bg-secondary)] border-[var(--border-primary)] opacity-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    item.tier === 'Gold' ? "bg-yellow-400" : item.tier === 'Silver' ? "bg-slate-300" : "bg-emerald-500"
                  )} />
                  <span className="font-bold text-[var(--text-primary)]">{item.tier} Analyst</span>
                </div>
                <span className="text-sm font-medium text-[var(--text-muted)]">{item.roi}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Claim History */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Payout History</h2>
          </div>
          <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-primary)] overflow-hidden">
            {history.length > 0 ? (
              <div className="divide-y divide-[var(--border-primary)]">
                {history.map((claim) => (
                  <div key={claim.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-[var(--text-primary)]">Alpha Conversion</span>
                        <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full uppercase">Success</span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">{new Date(claim.claimedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-emerald-400">+{parseFloat(claim.creditAmount).toFixed(2)} Credits</div>
                      <div className="text-[10px] text-[var(--text-muted)]">from {parseFloat(claim.alphaAmount).toLocaleString()} Alpha</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mb-4">
                  <RefreshCw className="w-6 h-6 text-[var(--text-muted)]" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">No claims found</h3>
                <p className="text-xs text-[var(--text-muted)]">Your payout history will appear here once you convert Alpha.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
