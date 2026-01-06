"use client";

import { useState } from "react";
import { ShieldCheck, Trash2, X, Loader2, AlertTriangle, CreditCard, Globe, Settings } from "lucide-react";

interface BrandActionsProps {
  brand: {
    id: string;
    name: string;
    website: string | null;
    subscriptionTier: string;
    subscriptionStatus: string;
  };
}

export default function BrandActions({ brand }: BrandActionsProps) {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Subscription form state
  const [tier, setTier] = useState(brand.subscriptionTier);
  const [status, setStatus] = useState(brand.subscriptionStatus);
  const [website, setWebsite] = useState(brand.website || "");

  const handleUpdateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/brands/${brand.id}/subscription`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, status, website }),
      });
      if (!res.ok) throw new Error("Failed to update subscription");
      window.location.reload();
    } catch {
      setError("Failed to update subscription");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/brands/${brand.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete brand");
      window.location.reload();
    } catch {
      setError("Failed to delete brand");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-end items-center gap-2">
        <button 
          onClick={() => setShowSubscriptionModal(true)}
          className="h-8 w-8 rounded-lg bg-zinc-100 text-zinc-400 flex items-center justify-center hover:bg-zinc-200 hover:text-indigo-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer transition-all"
          title="Manage Subscription"
        >
          <ShieldCheck className="h-4 w-4" />
        </button>
        <button 
          onClick={() => setShowDeleteModal(true)}
          className="h-8 w-8 rounded-lg bg-zinc-100 text-zinc-400 flex items-center justify-center hover:bg-zinc-200 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer transition-all"
          title="Delete Brand"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSubscriptionModal(false)} />
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <button onClick={() => setShowSubscriptionModal(false)} className="absolute right-4 top-4 rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer">
              <X className="h-5 w-5" />
            </button>
            <div className="mb-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 mb-4">
                <Settings className="h-7 w-7 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-center">Brand Settings</h2>
              <p className="text-sm text-zinc-500 text-center mt-1">{brand.name}</p>
            </div>
            <form onSubmit={handleUpdateSubscription} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://brand.com"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Subscription Tier</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-800 appearance-none cursor-pointer"
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Status</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-800 appearance-none cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="past_due">Past Due</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-700 cursor-pointer"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <button onClick={() => setShowDeleteModal(false)} className="absolute right-4 top-4 rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer">
              <X className="h-5 w-5" />
            </button>
            <div className="mb-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 mb-4">
                <AlertTriangle className="h-7 w-7 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-center text-red-900">Delete Brand</h2>
              <p className="text-sm text-zinc-500 text-center mt-1">Are you sure you want to delete {brand.name}?</p>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-zinc-500 text-center">This will permanently remove the brand and all associated data including products and reviews.</p>
              {error && <p className="text-xs text-red-500 text-center">{error}</p>}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 rounded-xl bg-zinc-100 py-3 text-sm font-bold text-zinc-700 hover:bg-zinc-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700 cursor-pointer"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
