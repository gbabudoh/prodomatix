
"use client";

import React from "react";
import { Settings2, RefreshCcw, ShieldCheck, User } from "lucide-react";

interface ControlPanelProps {
  productId: string;
  setProductId: (id: string) => void;
  isVerified: boolean;
  setIsVerified: (v: boolean) => void;
}

export default function ControlPanel({ 
    productId, 
    setProductId, 
    isVerified, 
    setIsVerified 
}: ControlPanelProps) {
  return (
    <div className="rounded-3xl border border-indigo-100 bg-white p-8 shadow-xl shadow-indigo-500/5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <Settings2 className="h-5 w-5" />
        </div>
        <div>
            <h3 className="text-xl font-bold">Demo Controls</h3>
            <p className="text-xs text-zinc-500 font-medium">Configure the Sandbox environment</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block">Active Product ID</label>
            <input 
                type="text" 
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-xs font-mono text-zinc-600 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
            />
            <p className="text-[10px] text-zinc-400 italic">Change this to test different catalog items.</p>
        </div>

        <div className="space-y-4 pt-6 border-t border-zinc-50 dark:border-zinc-800">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block">Widget State Simulation</label>
            
            <button 
                onClick={() => setIsVerified(!isVerified)}
                className={`flex w-full items-center justify-between rounded-xl border p-4 transition-all ${
                    isVerified 
                    ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/20" 
                    : "border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                }`}
            >
                <div className="flex items-center gap-3">
                    <ShieldCheck className={isVerified ? "text-emerald-500" : "text-zinc-300"} />
                    <div className="text-left">
                        <p className={`text-xs font-bold ${isVerified ? "text-emerald-700 dark:text-emerald-400" : "text-zinc-500"}`}>Verified Buyer Mode</p>
                        <p className="text-[10px] text-zinc-400">Force verified status on next submission</p>
                    </div>
                </div>
                <div className={`h-4 w-4 rounded-full border-2 ${isVerified ? "bg-emerald-500 border-emerald-500" : "border-zinc-200"}`}></div>
            </button>

            <button 
                disabled
                className="flex w-full items-center justify-between rounded-xl border border-zinc-100 bg-white p-4 opacity-50 cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div className="flex items-center gap-3">
                    <User className="text-zinc-300" />
                    <div className="text-left">
                        <p className="text-xs font-bold text-zinc-500">Auto-Fill Identity</p>
                        <p className="text-[10px] text-zinc-400">Simulate logged-in customer data</p>
                    </div>
                </div>
                <div className="h-4 w-4 rounded-full border-2 border-zinc-200"></div>
            </button>
        </div>

        <button 
            onClick={() => window.location.reload()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-all font-mono uppercase tracking-widest"
        >
            <RefreshCcw className="h-4 w-4" />
            Hard Reset Widget
        </button>
      </div>
      
      <div className="mt-8 rounded-xl bg-indigo-600 p-4 text-white shadow-lg shadow-indigo-600/20 relative overflow-hidden">
        <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Sandbox Pro Tip</p>
            <p className="text-xs font-medium leading-relaxed">
                Use the &quot;POST /api/reviews&quot; endpoint in the documentation to populate test data 
                here in real-time.
            </p>
        </div>
        <Settings2 className="absolute -bottom-4 -right-4 h-20 w-20 text-white/10 rotate-12" />
      </div>
    </div>
  );
}
