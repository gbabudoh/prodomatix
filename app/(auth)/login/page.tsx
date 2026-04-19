"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Zap,
  BarChart3,
  Users,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);

      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (returnTo) {
        router.push(returnTo);
      } else if (data.user.role === "owner") {
        router.push("/business/dashboard");
      } else {
        router.push("/consumer");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </motion.div>
      )}

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl pl-12 pr-4 py-3.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl pl-12 pr-12 py-3.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-emerald-500 focus:ring-emerald-500/50 cursor-pointer"
          />
          <span className="text-sm text-[var(--text-secondary)]">Remember me</span>
        </label>
        <Link
          href="/forgot-password"
          className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        isLoading={isLoading}
      >
        Sign In
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--border-primary)]" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[var(--bg-secondary)] text-[var(--text-muted)]">
            Demo Accounts
          </span>
        </div>
      </div>

      {/* Demo Account Quick Access */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            setEmail("cosumer@demo.com");
            setPassword("consumeracess");
          }}
          className="p-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all cursor-pointer group"
        >
          <Users className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <span className="text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">Consumer Demo</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setEmail("busines@demo.com");
            setPassword("businessacess");
          }}
          className="p-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] hover:border-blue-500/30 hover:bg-blue-500/5 transition-all cursor-pointer group"
        >
          <BarChart3 className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <span className="text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">Business Demo</span>
        </button>
      </div>
    </form>
  );
}

export default function LoginPage() {
  const features = [
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track sentiment trends as they happen",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security for your data",
    },
    {
      icon: Zap,
      title: "Instant Insights",
      description: "Make data-driven decisions faster",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-[var(--bg-secondary)] to-teal-500/20" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="font-bold text-[var(--text-primary)] text-xl">Prodomatix</span>
              <span className="block text-xs text-[var(--text-muted)]">Sentiment Exchange</span>
            </div>
          </Link>

          {/* Main Content */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl xl:text-5xl font-bold text-[var(--text-primary)] leading-tight mb-6"
            >
              The Stock Market
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                of Sentiment
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-[var(--text-secondary)] mb-10 max-w-md"
            >
              Track real-time product sentiment, analyze market trends, and make data-driven decisions.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              {features.map((feature, index) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <feature.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--text-primary)]">{feature.title}</h3>
                    <p className="text-sm text-[var(--text-muted)]">{feature.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-8"
          >
            <div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">10K+</div>
              <div className="text-sm text-[var(--text-muted)]">Active Users</div>
            </div>
            <div className="w-px h-10 bg-[var(--border-primary)]" />
            <div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">500+</div>
              <div className="text-sm text-[var(--text-muted)]">Products</div>
            </div>
            <div className="w-px h-10 bg-[var(--border-primary)]" />
            <div>
              <div className="text-2xl font-bold text-emerald-400">99.9%</div>
              <div className="text-sm text-[var(--text-muted)]">Uptime</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-6">
          <Link href="/" className="lg:hidden flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-[var(--text-primary)]">Prodomatix</span>
          </Link>
          <div className="flex items-center gap-4 ml-auto">
            <ThemeToggle variant="icon" />
            <Link href="/register">
              <Button variant="secondary" size="sm">
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                Welcome back
              </h2>
              <p className="text-[var(--text-muted)]">
                Sign in to access your dashboard
              </p>
            </div>

            {/* Form Card */}
            <div className="p-8 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
                  </div>
                }
              >
                <LoginForm />
              </Suspense>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-[var(--text-muted)] text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
                >
                  Create one for free
                </Link>
              </p>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex items-center justify-center gap-6">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <Shield className="w-4 h-4" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <CheckCircle className="w-4 h-4" />
                <span>GDPR Compliant</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
