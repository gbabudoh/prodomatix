"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { Card } from "@/components/shared/card";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Mail,
  Lock,
  User,
  Building2,
  ShoppingBag,
  ArrowRight,
  Check,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

const countries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "BR", name: "Brazil" },
  { code: "IN", name: "India" },
  { code: "NG", name: "Nigeria" },
  { code: "MX", name: "Mexico" },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") as "owner" | "consumer" | null;
  const { register, isLoading } = useAuthStore();

  const [step, setStep] = useState(defaultRole ? 2 : 1);
  const [role, setRole] = useState<"owner" | "consumer">(defaultRole || "consumer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [error, setError] = useState("");

  const handleRoleSelect = (selectedRole: "owner" | "consumer") => {
    setRole(selectedRole);
    setStep(2);
  };

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

    try {
      await register({ email, password, name, role, countryCode });

      // Redirect based on role
      if (role === "owner") {
        router.push("/dashboard");
      } else {
        router.push("/consumer");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <>
      {/* Step 1: Role Selection */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card
              hover
              className="cursor-pointer p-6 text-center"
              onClick={() => handleRoleSelect("owner")}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Business Owner
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                List your products, track sentiment, and grow your brand
              </p>
              <ul className="text-left space-y-2 text-sm">
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Launch product IPOs
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Global heat map analytics
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-emerald-400" />
                  AdFlow promotions
                </li>
              </ul>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              hover
              className="cursor-pointer p-6 text-center"
              onClick={() => handleRoleSelect("consumer")}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Consumer</h3>
              <p className="text-gray-400 text-sm mb-4">
                Rate products, track trends, and make informed decisions
              </p>
              <ul className="text-left space-y-2 text-sm">
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Rate products & services
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Build your watchlist
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Join Prodo Groups
                </li>
              </ul>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Step 2: Registration Form */}
      {step === 2 && (
        <Card variant="glass" className="p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                role === "owner"
                  ? "bg-blue-500/20"
                  : "bg-emerald-500/20"
              )}
            >
              {role === "owner" ? (
                <Building2 className="w-5 h-5 text-blue-400" />
              ) : (
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <div>
              <p className="text-white font-medium">
                {role === "owner" ? "Business Account" : "Consumer Account"}
              </p>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-gray-500 hover:text-emerald-400 cursor-pointer"
              >
                Change account type
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <Input
              label={role === "owner" ? "Business Name" : "Full Name"}
              type="text"
              placeholder={role === "owner" ? "Acme Inc." : "John Doe"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Country
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Create Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      )}
    </>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-white text-2xl">Prodomatix</span>
          </Link>
          <p className="text-gray-400 mt-4">Create your account</p>
        </div>

        <Suspense fallback={
          <Card variant="glass" className="p-8">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
            </div>
          </Card>
        }>
          <RegisterForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
