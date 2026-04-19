"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Mail,
  Lock,
  User,
  Building2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Check,
  Globe,
  Shield,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  BarChart3,
  Users,
  Zap,
} from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
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

      if (role === "owner") {
        router.push("/business/dashboard");
      } else {
        router.push("/consumer");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: "Weak", color: "bg-red-500" };
    if (strength <= 3) return { strength, label: "Fair", color: "bg-amber-500" };
    if (strength <= 4) return { strength, label: "Good", color: "bg-emerald-500" };
    return { strength, label: "Strong", color: "bg-emerald-400" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <>
      {/* Step 1: Role Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              Choose your account type
            </h2>
            <p className="text-[var(--text-muted)]">
              Select how you want to use Prodomatix
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => handleRoleSelect("consumer")}
              className="p-6 rounded-2xl border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                  <ShoppingBag className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                    Consumer Account
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] mb-3">
                    Rate products, track trends, and make informed decisions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Rate Products", "Build Watchlist", "Track Trends"].map((feature) => (
                      <span key={feature} className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                        <Check className="w-3 h-3" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-emerald-400 transition-colors" />
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => handleRoleSelect("owner")}
              className="p-6 rounded-2xl border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                    Business Account
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] mb-3">
                    List products, track sentiment, and grow your brand
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Launch IPS", "Analytics", "AdFlow Ads"].map((feature) => (
                      <span key={feature} className="inline-flex items-center gap-1 text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
                        <Check className="w-3 h-3" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-blue-400 transition-colors" />
              </div>
            </motion.button>
          </div>
        </div>
      )}

      {/* Step 2: Registration Form */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Account Type Header */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
            <div className={cn(
              "p-2.5 rounded-xl",
              role === "owner" ? "bg-blue-500/10 border border-blue-500/20" : "bg-emerald-500/10 border border-emerald-500/20"
            )}>
              {role === "owner" ? (
                <Building2 className="w-5 h-5 text-blue-400" />
              ) : (
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-[var(--text-primary)]">
                {role === "owner" ? "Business Account" : "Consumer Account"}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {role === "owner" ? "List and manage products" : "Rate and track products"}
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Change
            </button>
          </div>

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

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                {role === "owner" ? "Business Name" : "Full Name"}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder={role === "owner" ? "Acme Inc." : "John Doe"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl pl-12 pr-4 py-3.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Country
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl pl-12 pr-4 py-3.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
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
              {/* Password Strength */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                      <div
                        className={cn("h-full transition-all", passwordStrength.color)}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      />
                    </div>
                    <span className={cn(
                      "text-xs font-medium",
                      passwordStrength.strength <= 2 ? "text-red-400" :
                      passwordStrength.strength <= 3 ? "text-amber-400" : "text-emerald-400"
                    )}>
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={cn(
                    "w-full bg-[var(--bg-tertiary)] border rounded-xl pl-12 pr-12 py-3.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 transition-all",
                    confirmPassword && password !== confirmPassword
                      ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                      : confirmPassword && password === confirmPassword
                      ? "border-emerald-500/50 focus:ring-emerald-500/50 focus:border-emerald-500"
                      : "border-[var(--border-primary)] focus:ring-emerald-500/50 focus:border-emerald-500"
                  )}
                />
                {confirmPassword && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {password === confirmPassword ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-[var(--text-muted)]">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-emerald-400 hover:underline cursor-pointer">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-emerald-400 hover:underline cursor-pointer">Privacy Policy</Link>.
            </p>

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
        </div>
      )}
    </>
  );
}

export default function RegisterPage() {
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Join 10,000+ users</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl xl:text-5xl font-bold text-[var(--text-primary)] leading-tight mb-6"
            >
              Start tracking
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                sentiment today
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-[var(--text-secondary)] mb-10 max-w-md"
            >
              Create your free account and join the world&apos;s first sentiment exchange platform.
            </motion.p>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: BarChart3, label: "Real-time Analytics" },
                { icon: Shield, label: "Secure Platform" },
                { icon: Users, label: "Active Community" },
                { icon: Zap, label: "Instant Insights" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-primary)]">
                  <item.icon className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 rounded-2xl bg-[var(--bg-secondary)]/50 border border-[var(--border-primary)]"
          >
            <p className="text-[var(--text-secondary)] italic mb-4">
              &ldquo;Prodomatix has transformed how we understand customer sentiment. The real-time data is invaluable.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
                S
              </div>
              <div>
                <p className="font-medium text-[var(--text-primary)]">Sarah Chen</p>
                <p className="text-sm text-[var(--text-muted)]">Product Manager, TechCorp</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
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
            <Link href="/login">
              <Button variant="secondary" size="sm">
                Sign In
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
            {/* Form Card */}
            <div className="p-8 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
                  </div>
                }
              >
                <RegisterForm />
              </Suspense>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-[var(--text-muted)] text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
                >
                  Sign in
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
