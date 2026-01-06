"use client";

import { useState } from "react";
import { X, Mail, Building2, Loader2, CheckCircle2 } from "lucide-react";

interface InviteBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteBrandModal({ isOpen, onClose }: InviteBrandModalProps) {
  const [email, setEmail] = useState("");
  const [brandName, setBrandName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/brands/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, brandName }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send invitation");
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setEmail("");
        setBrandName("");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invitation");
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
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Invitation Sent!</h2>
            <p className="text-sm text-zinc-500 mt-2">An invitation has been sent to {email}</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 mb-4">
                <Building2 className="h-7 w-7 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 text-center">Invite New Brand</h2>
              <p className="text-sm text-zinc-500 text-center mt-1">Send an invitation to onboard a new brand partner</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Brand Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Acme Corporation"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Contact Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@brand.com"
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
                  "Send Invitation"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
