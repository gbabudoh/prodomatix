
"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { Zap, Mail, Lock, Loader2, ArrowRight, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/admin",
      });

      if (result?.error) {
        setError("Invalid administrative credentials");
      } else {
        window.location.href = "/admin";
      }
    } catch (err) {
      console.error(err);
      setError("System authentication failure");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6 font-sans">
      {/* Structural accent - Light Admin Theme */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

      <div className="relative w-full max-w-[440px]">
        {/* Internal Portal Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white border-2 border-indigo-100 shadow-2xl mb-8 group cursor-default">
            <Zap className="h-10 w-10 text-indigo-600 fill-current animate-pulse" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-3">
            Master Access
          </h1>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 border border-indigo-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Prodomatix Internal</span>
          </div>
        </div>

        {/* Master Login Card */}
        <div className="overflow-hidden rounded-[2.5rem] border-2 border-zinc-100 bg-white p-10 shadow-2xl">
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 ml-1">Internal Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-indigo-600" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@prodomatix.net"
                  className="w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50 py-4.5 pl-12 pr-4 text-sm text-zinc-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 ml-1">Master Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-indigo-600" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50 py-4.5 pl-12 pr-4 text-sm text-zinc-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-zinc-400"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 rounded-2xl bg-red-50 border-2 border-red-200 p-4 text-red-600 animate-in fade-in slide-in-from-top-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <p className="text-xs font-bold leading-none">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-indigo-600 py-4.5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 cursor-pointer shadow-xl shadow-indigo-600/20"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Authenticate Access
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-12 text-center space-y-4">
            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest leading-loose max-w-[280px] mx-auto">
                Unauthorized access to this portal is strictly prohibited and subject to professional audit.
            </p>
            <div className="flex justify-center gap-6">
                <button onClick={() => window.location.href = "/"} className="text-[10px] font-black text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest cursor-pointer">Help Desk</button>
                <button onClick={() => window.location.href = "/"} className="text-[10px] font-black text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest cursor-pointer">Public Site</button>
            </div>
        </div>
      </div>
    </div>
  );
}
