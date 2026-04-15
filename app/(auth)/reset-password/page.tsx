"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { Card } from "@/components/shared/card";
import { motion } from "framer-motion";
import { TrendingUp, Lock, CheckCircle, XCircle, ArrowRight } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setIsValidating(false);
        return;
      }

      try {
        const res = await fetch(`/api/auth/reset-password?token=${token}`);
        const data = await res.json();
        setIsValidToken(data.valid);
      } catch {
        setIsValidToken(false);
      } finally {
        setIsValidating(false);
      }
    }

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <Card variant="glass" className="p-8">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
        </div>
      </Card>
    );
  }

  if (!token || !isValidToken) {
    return (
      <Card variant="glass" className="p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Invalid or Expired Link</h2>
          <p className="text-gray-400 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link href="/forgot-password">
            <Button className="w-full">Request New Link</Button>
          </Link>
        </div>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card variant="glass" className="p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Password Reset!</h2>
          <p className="text-gray-400 mb-6">
            Your password has been successfully reset. Redirecting to sign in...
          </p>
          <Link href="/login">
            <Button className="w-full">
              Sign In Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Create New Password</h2>
        <p className="text-gray-400 text-sm">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <Input
          label="New Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          required
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          required
        />

        <div className="text-xs text-gray-500 space-y-1">
          <p>Password must contain:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>At least 8 characters</li>
            <li>One uppercase letter</li>
            <li>One lowercase letter</li>
            <li>One number</li>
          </ul>
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Reset Password
        </Button>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
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
        </div>

        <Suspense
          fallback={
            <Card variant="glass" className="p-8">
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
              </div>
            </Card>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
