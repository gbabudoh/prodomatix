"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Globe,
  Calendar,
  Shield,
  LogOut,
  Save,
  CheckCircle,
  Palette,
  Bell,
  Lock,
  ChevronRight,
  Sparkles,
  Award,
  Star,
  TrendingUp,
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

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, setUser } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [countryCode, setCountryCode] = useState(user?.countryCode || "US");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "security">("profile");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/consumer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, countryCode }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update profile");
      }
    } catch {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Palette },
    { id: "security", label: "Security", icon: Lock },
  ];

  return (
    <div className="p-6 md:p-8 pb-28 md:pb-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
            <User className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Profile Settings
            </h1>
            <p className="text-[var(--text-secondary)]">
              Manage your account and preferences
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] overflow-hidden sticky top-24">
            {/* Profile Header */}
            <div className="p-6 text-center border-b border-[var(--border-primary)] bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                <span className="text-white font-bold text-3xl">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">{user?.name}</h2>
              <p className="text-sm text-[var(--text-muted)]">{user?.email}</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                  Consumer
                </span>
                {user?.isVerified && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">Ratings</span>
                </div>
                <span className="font-semibold text-[var(--text-primary)]">24</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Avg Score</span>
                </div>
                <span className="font-semibold text-emerald-400">7.8</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Member Since</span>
                </div>
                <span className="font-semibold text-[var(--text-primary)]">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Upgrade Card */}
            <div className="p-4 border-t border-[var(--border-primary)]">
              <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-[var(--text-primary)]">Pro Account</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-3">
                  Unlock advanced features and analytics.
                </p>
                <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 space-y-6"
        >
          {/* Tabs */}
          <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] p-2">
            <div className="flex gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer",
                      activeTab === tab.id
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] overflow-hidden">
              <div className="p-5 border-b border-[var(--border-primary)]">
                <h3 className="font-semibold text-[var(--text-primary)]">Personal Information</h3>
                <p className="text-sm text-[var(--text-muted)]">Update your personal details</p>
              </div>
              <div className="p-5 space-y-5">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {saved && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Profile updated successfully
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl pl-12 pr-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full bg-[var(--bg-tertiary)]/50 border border-[var(--border-primary)] rounded-xl pl-12 pr-4 py-3 text-[var(--text-muted)] cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-2">
                    Email cannot be changed for security reasons
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Country
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl pl-12 pr-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] rotate-90" />
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-medium rounded-xl transition-colors cursor-pointer"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] overflow-hidden">
                <div className="p-5 border-b border-[var(--border-primary)]">
                  <h3 className="font-semibold text-[var(--text-primary)]">Appearance</h3>
                  <p className="text-sm text-[var(--text-muted)]">Customize how Prodomatix looks</p>
                </div>
                <div className="p-5">
                  <ThemeToggle variant="full" />
                </div>
              </div>

              <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] overflow-hidden">
                <div className="p-5 border-b border-[var(--border-primary)]">
                  <h3 className="font-semibold text-[var(--text-primary)]">Notifications</h3>
                  <p className="text-sm text-[var(--text-muted)]">Manage your notification preferences</p>
                </div>
                <div className="p-5 space-y-4">
                  {[
                    { label: "Price Alerts", description: "Get notified when watchlist items change significantly" },
                    { label: "Rating Updates", description: "Notifications when products you rated get new ratings" },
                    { label: "Weekly Digest", description: "Summary of market activity and your portfolio" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-[var(--border-primary)] last:border-0">
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">{item.label}</div>
                        <div className="text-sm text-[var(--text-muted)]">{item.description}</div>
                      </div>
                      <button className="w-12 h-7 bg-emerald-500 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] overflow-hidden">
                <div className="p-5 border-b border-[var(--border-primary)]">
                  <h3 className="font-semibold text-[var(--text-primary)]">Account Security</h3>
                  <p className="text-sm text-[var(--text-muted)]">Manage your security settings</p>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-[var(--border-primary)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center">
                        <Lock className="w-5 h-5 text-[var(--text-muted)]" />
                      </div>
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">Password</div>
                        <div className="text-sm text-[var(--text-muted)]">Last changed 30 days ago</div>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer">
                      Change
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-[var(--border-primary)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-[var(--text-muted)]" />
                      </div>
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">Two-Factor Authentication</div>
                        <div className="text-sm text-[var(--text-muted)]">Add an extra layer of security</div>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer">
                      Enable
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center">
                        <Bell className="w-5 h-5 text-[var(--text-muted)]" />
                      </div>
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">Login Alerts</div>
                        <div className="text-sm text-[var(--text-muted)]">Get notified of new sign-ins</div>
                      </div>
                    </div>
                    <button className="w-12 h-7 bg-emerald-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-[var(--bg-secondary)] rounded-2xl border border-red-500/20 overflow-hidden">
                <div className="p-5 border-b border-red-500/20">
                  <h3 className="font-semibold text-red-400">Danger Zone</h3>
                  <p className="text-sm text-[var(--text-muted)]">Irreversible account actions</p>
                </div>
                <div className="p-5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-xl border border-red-500/30 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
