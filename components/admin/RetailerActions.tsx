"use client";

import { useState } from "react";
import { Key, Settings, Trash2, X, Loader2, CheckCircle2, Copy, Globe, AlertTriangle } from "lucide-react";

interface RetailerActionsProps {
  retailer: {
    id: string;
    name: string;
    website: string | null;
    apiKey: string | null;
    webhookUrl: string | null;
    webhookSecret: string | null;
  };
}

export default function RetailerActions({ retailer }: RetailerActionsProps) {
  const [showApiModal, setShowApiModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  
  // Settings form state
  const [webhookUrl, setWebhookUrl] = useState(retailer.webhookUrl || "");

  const handleCopyApiKey = async () => {
    if (retailer.apiKey) {
      await navigator.clipboard.writeText(retailer.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerateKey = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/retailers/${retailer.id}/regenerate-key`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to regenerate key");
      window.location.reload();
    } catch {
      setError("Failed to regenerate API key");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/retailers/${retailer.id}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl }),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      window.location.reload();
    } catch {
      setError("Failed to update settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/retailers/${retailer.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete retailer");
      window.location.reload();
    } catch {
      setError("Failed to delete retailer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-end items-center gap-2">
        <button 
          onClick={() => setShowApiModal(true)}
          className="h-8 w-8 rounded-lg bg-zinc-100 text-zinc-400 flex items-center justify-center hover:bg-zinc-200 hover:text-indigo-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer transition-all"
          title="View API Key"
        >
          <Key className="h-4 w-4" />
        </button>
        <button 
          onClick={() => setShowSettingsModal(true)}
          className="h-8 w-8 rounded-lg bg-zinc-100 text-zinc-400 flex items-center justify-center hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer transition-all"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
        <button 
          onClick={() => setShowDeleteModal(true)}
          className="h-8 w-8 rounded-lg bg-zinc-100 text-zinc-400 flex items-center justify-center hover:bg-zinc-200 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer transition-all"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* API Key Modal */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowApiModal(false)} />
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <button onClick={() => setShowApiModal(false)} className="absolute right-4 top-4 rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer">
              <X className="h-5 w-5" />
            </button>
            <div className="mb-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 mb-4">
                <Key className="h-7 w-7 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-center">API Credentials</h2>
              <p className="text-sm text-zinc-500 text-center mt-1">{retailer.name}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">API Key</label>
                <div className="flex gap-2">
                  <code className="flex-1 rounded-xl bg-zinc-100 px-4 py-3 text-xs font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 overflow-hidden text-ellipsis">
                    {retailer.apiKey || "No key generated"}
                  </code>
                  <button 
                    onClick={handleCopyApiKey}
                    className="rounded-xl bg-zinc-100 px-3 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 cursor-pointer"
                  >
                    {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Webhook Secret</label>
                <code className="block w-full rounded-xl bg-zinc-100 px-4 py-3 text-xs font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 overflow-hidden text-ellipsis">
                  {retailer.webhookSecret || "No secret generated"}
                </code>
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button
                onClick={handleRegenerateKey}
                disabled={isLoading}
                className="w-full rounded-xl bg-amber-100 py-3 text-sm font-bold text-amber-700 hover:bg-amber-200 cursor-pointer"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Regenerate Keys"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSettingsModal(false)} />
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <button onClick={() => setShowSettingsModal(false)} className="absolute right-4 top-4 rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer">
              <X className="h-5 w-5" />
            </button>
            <div className="mb-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 mb-4">
                <Settings className="h-7 w-7 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-center">Retailer Settings</h2>
              <p className="text-sm text-zinc-500 text-center mt-1">{retailer.name}</p>
            </div>
            <form onSubmit={handleUpdateSettings} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Webhook URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-server.com/webhook"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">We&apos;ll POST new reviews to this URL</p>
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-700 cursor-pointer"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Save Settings"}
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
              <h2 className="text-xl font-bold text-center text-red-900">Delete Retailer</h2>
              <p className="text-sm text-zinc-500 text-center mt-1">Are you sure you want to delete {retailer.name}?</p>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-zinc-500 text-center">This action cannot be undone. All API credentials will be revoked.</p>
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
