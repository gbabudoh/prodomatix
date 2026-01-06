"use client";

import { useState } from "react";
import { X, Store, Globe, Loader2, CheckCircle2 } from "lucide-react";

interface AddRetailerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddRetailerModal({ isOpen, onClose }: AddRetailerModalProps) {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/retailers/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, website }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add retailer");
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setName("");
        setWebsite("");
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add retailer");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-all cursor-pointer dark:hover:bg-zinc-800"
        >
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Partner Added!</h2>
            <p className="text-sm text-zinc-500 mt-2">{name} has been added to your network</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 mb-4">
                <Store className="h-7 w-7 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 text-center">Add Store Partner</h2>
              <p className="text-sm text-zinc-500 text-center mt-1">Add a new retailer to your syndication network</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Store Name</label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Amazon, Walmart, Best Buy..."
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Website (Optional)</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://retailer.com"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-medium text-red-600 dark:bg-red-900/20 dark:border-red-900/30">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 cursor-pointer shadow-lg shadow-indigo-600/20"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  "Add Partner"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
