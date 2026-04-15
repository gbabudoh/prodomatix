"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { Card } from "@/components/shared/card";
import { motion } from "framer-motion";
import { TrendingUp, Mail, Lock, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);

      // Redirect based on user role
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (returnTo) {
        router.push(returnTo);
      } else if (data.user.role === "owner") {
        router.push("/dashboard");
      } else {
        router.push("/consumer");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <Card variant="glass" className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          required
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
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
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Create one
          </Link>
        </p>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-white text-2xl">Prodomatix</span>
          </Link>
          <p className="text-gray-400 mt-4">Sign in to your account</p>
        </div>

        <Suspense fallback={
          <Card variant="glass" className="p-8">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
            </div>
          </Card>
        }>
          <LoginForm />
        </Suspense>

        {/* Quick access links */}
        <div className="mt-6 flex justify-center gap-4 text-sm">
          <Link
            href="/register?role=owner"
            className="text-gray-500 hover:text-emerald-400 transition-colors"
          >
            Register as Business
          </Link>
          <span className="text-gray-700">•</span>
          <Link
            href="/register?role=consumer"
            className="text-gray-500 hover:text-emerald-400 transition-colors"
          >
            Register as Consumer
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
