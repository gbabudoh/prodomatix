
"use client";

import React, { useState } from "react";
import StoreFront from "@/components/sandbox/StoreFront";
import ControlPanel from "@/components/sandbox/ControlPanel";
import { MoveLeft, Layout } from "lucide-react";
import Link from "next/link";

export default function SandboxPage() {
  const [productId, setProductId] = useState("5ca6dd48-7359-4221-9065-aba57099f696");
  const [isVerified, setIsVerified] = useState(true);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-50">
      {/* Sandbox Header */}
      <div className="border-b border-zinc-200 bg-white/80 px-6 py-4 backdrop-blur-md sticky top-0 z-40 dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
            <div className="flex items-center gap-6">
                <Link href="/" className="group flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                    <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Exit Sandbox
                </Link>
                <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                        <Layout className="h-4 w-4" />
                    </div>
                    <div>
                        <span className="text-sm font-black uppercase tracking-widest">Environment</span>
                        <p className="text-[10px] text-indigo-600 font-bold -mt-1 uppercase tracking-[0.2em]">Sandbox Mode</p>
                    </div>
                </div>
            </div>

            <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-2 justify-end">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Systems Nominal
                </p>
                <p className="text-[10px] text-zinc-400">Mock Retailer: Prodomatix Direct</p>
            </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr,320px]">
          {/* Main PDP View */}
          <div className="space-y-12">
            <StoreFront productId={productId} />
          </div>

          {/* Sidebar Controls */}
          <aside className="space-y-6">
            <ControlPanel 
              productId={productId} 
              setProductId={setProductId}
              isVerified={isVerified}
              setIsVerified={setIsVerified}
            />

            <div className="rounded-2xl border border-zinc-200 bg-zinc-100/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Technical Summary</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                    This sandbox environment uses the production <code className="text-[10px] font-mono">widget.js</code> 
                    in a sandboxed container to demonstrate real-time data persistence and AI moderation logic.
                </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
