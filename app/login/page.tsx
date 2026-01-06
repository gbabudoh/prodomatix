
"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { Zap, Github, Chrome, ShieldCheck, ArrowRight, Mail, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
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
            Welcome back
          </h1>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Login to access your enterprise dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:shadow-none backdrop-blur-sm">
          <div className="p-8">
            <form onSubmit={handleCredentialsLogin} className="space-y-4 mb-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>Sign In</>
                )}
              </button>
            </form>

            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Or Continue With
              </span>
              <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="flex items-center justify-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-50 hover:border-zinc-300 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
              >
                <Chrome className="h-5 w-5 text-indigo-500" />
                Google
              </button>
              <button
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="flex items-center justify-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-50 hover:border-zinc-300 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
              >
                <Github className="h-5 w-5 text-zinc-900 dark:text-white fill-current" />
                GitHub
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-zinc-500">
                Don&apos;t have an account? 
                <button 
                  onClick={() => window.location.href = "/register"}
                  className="font-bold text-indigo-600 hover:text-indigo-500 cursor-pointer"
                >
                  Create Account
                </button>
            </div>

            <div className="mt-8 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-950">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-indigo-500" />
                <p className="text-xs font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
                  By signing in, you agree to our <a href="/terms" className="text-zinc-900 underline dark:text-zinc-300">Terms of Service</a> and confirm you are an authorized partner.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex items-center justify-between px-2">
            <button 
                onClick={() => window.location.href = "/"}
                className="group flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
            >
                Back to Site
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Prodomatix Core v1.0</span>
        </div>
      </div>
    </div>
  );
}
