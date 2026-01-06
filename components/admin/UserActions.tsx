"use client";

import { useState } from "react";
import { Shield, Trash2, X, Loader2, AlertTriangle, Building2, Store, User } from "lucide-react";

interface UserActionsProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: string | null;
    brandId: string | null;
    retailerId: string | null;
  };
  brands: Array<{ id: string; name: string }>;
  retailers: Array<{ id: string; name: string }>;
}

export default function UserActions({ user, brands, retailers }: UserActionsProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form state
  const [role, setRole] = useState(user.role || "user");
  const [brandId, setBrandId] = useState(user.brandId || "");
  const [retailerId, setRetailerId] = useState(user.retailerId || "");

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          role, 
          brandId: brandId || null, 
          retailerId: retailerId || null 
        }),
      });
      if (!res.ok) throw new Error("Failed to update user");
      window.location.reload();
    } catch {
      setError("Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      window.location.reload();
    } catch {
      setError("Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-end items-center gap-2">
        <button 
          onClick={() => setShowEditModal(true)}
          className="h-8 w-8 rounded-lg bg-zinc-100 text-zinc-400 flex items-center justify-center hover:bg-zinc-200 hover:text-indigo-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer transition-all"
          title="Edit User"
        >
          <Shield className="h-4 w-4" />
        </button>
        <button 
          onClick={() => setShowDeleteModal(true)}
          className="h-8 w-8 rounded-lg bg-zinc-100 text-zinc-400 flex items-center justify-center hover:bg-zinc-200 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer transition-all"
          title="Delete User"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <button onClick={() => setShowEditModal(false)} className="absolute right-4 top-4 rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer">
              <X className="h-5 w-5" />
            </button>
            <div className="mb-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 mb-4">
                <User className="h-7 w-7 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-center">Edit User</h2>
              <p className="text-sm text-zinc-500 text-center mt-1">{user.name || user.email}</p>
            </div>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Role</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-800 appearance-none cursor-pointer"
                  >
                    <option value="user">User</option>
                    <option value="brand_user">Brand User</option>
                    <option value="retailer_user">Retailer User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Associated Brand</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <select
                    value={brandId}
                    onChange={(e) => {
                      setBrandId(e.target.value);
                      if (e.target.value) setRetailerId("");
                    }}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-800 appearance-none cursor-pointer"
                  >
                    <option value="">No Brand</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Associated Retailer</label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <select
                    value={retailerId}
                    onChange={(e) => {
                      setRetailerId(e.target.value);
                      if (e.target.value) setBrandId("");
                    }}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-800 appearance-none cursor-pointer"
                  >
                    <option value="">No Retailer</option>
                    {retailers.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
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
              <h2 className="text-xl font-bold text-center text-red-900">Delete User</h2>
              <p className="text-sm text-zinc-500 text-center mt-1">Are you sure you want to delete {user.name || user.email}?</p>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-zinc-500 text-center">This will permanently remove the user account and all associated sessions.</p>
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
