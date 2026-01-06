
"use client";

import { User, Key, Zap, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Manage your brand profile, API keys, and notification preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-4 mb-6">
            <div className="rounded-lg bg-zinc-100 p-3 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Brand Profile</h2>
              <p className="text-sm text-zinc-500">Update your company information and logo.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Brand Name</label>
              <input type="text" defaultValue="Prodomatix Demo" className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Domain</label>
              <input type="text" defaultValue="prodomatix.ui" className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200" />
            </div>
          </div>
        </section>

        {/* API & Webhooks */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
           <div className="flex items-center gap-4 mb-6">
            <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
              <Key className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">API & Webhooks</h2>
              <p className="text-sm text-zinc-500">Secure your syndication endpoints.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-3 dark:bg-zinc-950">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Primary API Key</p>
                <p className="text-xs text-zinc-500">sk_prod_************************</p>
              </div>
              <button className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400 cursor-pointer">Reveal Key</button>
            </div>
            <button className="flex items-center gap-2 text-sm font-bold text-zinc-900 hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400 cursor-pointer transition-all">
              <Zap className="h-4 w-4" />
              Configure Webhooks
            </button>
          </div>
        </section>

        {/* Compliance & Legal */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
           <div className="flex items-center gap-4 mb-6">
            <div className="rounded-lg bg-zinc-100 p-3 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Compliance & Legal</h2>
              <p className="text-sm text-zinc-500">View and manage your data processor agreements.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <a href="/terms" className="flex items-center justify-center p-3 rounded-lg border border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800 transition-all text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Terms of Service
            </a>
            <a href="/privacy" className="flex items-center justify-center p-3 rounded-lg border border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800 transition-all text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Privacy Policy
            </a>
            <a href="/integrity" className="flex items-center justify-center p-3 rounded-lg border border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800 transition-all text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Integrity Standards
            </a>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="rounded-xl border border-red-100 bg-red-50/30 p-6 dark:border-red-900/30 dark:bg-red-900/10">
          <h2 className="text-lg font-bold text-red-900 dark:text-red-400">Danger Zone</h2>
          <p className="text-sm text-red-700 dark:text-red-500 mb-4">Permanent actions for your account.</p>
          <button className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:bg-zinc-950 dark:hover:bg-red-900/20 cursor-pointer transition-all active:scale-95">
            Delete Inventory Data
          </button>
        </section>
      </div>
    </div>
  );
}
