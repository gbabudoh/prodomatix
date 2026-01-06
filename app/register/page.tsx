
"use client";

import React from "react";
import { Zap, Mail, Lock, User, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { registerUser } from "./actions";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push("/login?registered=true");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-50 px-6 dark:bg-black">
      {/* Decorative Blobs */}
      <div className="absolute top-[10%] left-[10%] h-64 w-64 rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="absolute bottom-[10%] right-[10%] h-64 w-64 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="relative w-full max-w-[440px]">
        {/* Logo Section */}
        <div className="mb-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 dark:shadow-none mb-6 group cursor-default transition-all hover:scale-105 active:scale-95">
            <Zap className="h-8 w-8 text-indigo-600 fill-current" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
            Join the Network
          </h1>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Create your account to start managing reviews
          </p>
        </div>

        {/* Register Card */}
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:shadow-none backdrop-blur-sm">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input 
                    name="name"
                    type="text" 
                    required
                    placeholder="John Doe"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 dark:border-zinc-800 dark:bg-zinc-950/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input 
                    name="email"
                    type="email" 
                    required
                    placeholder="name@company.com"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 dark:border-zinc-800 dark:bg-zinc-950/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input 
                    name="password"
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 dark:border-zinc-800 dark:bg-zinc-950/50"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs font-bold text-red-500 ml-1">{error}</p>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>Create Account</>
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-zinc-500">
                Already have an account? 
                <button 
                  onClick={() => router.push("/login")}
                  className="font-bold text-indigo-600 hover:text-indigo-500 cursor-pointer"
                >
                  Sign In
                </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-6 rounded-3xl bg-indigo-50 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/30">
            <div className="flex gap-4">
                <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0" />
                <div>
                    <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-widest mb-1">Standard Security</h4>
                    <p className="text-[10px] leading-relaxed text-indigo-600/80 dark:text-indigo-400/80">
                        Enterprise-grade encryption for all password storage. Multi-factor authentication 
                        is available for admin accounts after first sign-in.
                    </p>
                </div>
            </div>
        </div>

        <button 
            onClick={() => router.push("/login")}
            className="mt-8 mx-auto flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
        >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Login
        </button>
      </div>
    </div>
  );
}
