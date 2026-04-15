"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/shared/button";
import { Card } from "@/components/shared/card";
import { motion } from "framer-motion";
import { TrendingUp, CheckCircle, XCircle, Mail, ArrowRight } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setError("No verification token provided");
        setIsVerifying(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setIsSuccess(true);
        } else {
          setError(data.error || "Failed to verify email");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    }

    verifyEmail();
  }, [token]);

  if (isVerifying) {
    return (
      <Card variant="glass" className="p-8">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Verifying your email...</h2>
          <p className="text-gray-400">Please wait a moment.</p>
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
          <h2 className="text-xl font-bold text-white mb-2">Email Verified!</h2>
          <p className="text-gray-400 mb-6">
            Your email has been successfully verified. You can now access all features.
          </p>
          <Link href="/login">
            <Button className="w-full">
              Continue to Sign In
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="p-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <div className="space-y-3">
          <Link href="/login">
            <Button variant="secondary" className="w-full">
              <Mail className="w-4 h-4 mr-2" />
              Request New Verification Email
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="w-full">
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

export default function VerifyEmailPage() {
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
          <VerifyEmailContent />
        </Suspense>
      </motion.div>
    </div>
  );
}
