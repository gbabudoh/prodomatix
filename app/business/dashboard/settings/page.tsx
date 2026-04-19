"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/shared/input";
import { Button } from "@/components/shared/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useAuthStore } from "@/store/auth-store";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Mail,
  Globe,
  Building2,
  Shield,
  LogOut,
  Save,
  CheckCircle,
  Bell,
  CreditCard,
  Palette,
  AlertCircle,
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

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, setUser } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [countryCode, setCountryCode] = useState(user?.countryCode || "US");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/owner/profile", {
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

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-1 flex items-center gap-3">
          <div className="p-2 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-primary)]">
            <Settings className="w-6 h-6 md:w-7 md:h-7 text-[var(--text-muted)]" />
          </div>
          Settings
        </h1>
        <p className="text-[var(--text-muted)]">Manage your account and preferences</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] overflow-hidden light-border">
          <div className="p-5 border-b border-[var(--border-primary)] flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">{user?.name}</h2>
              <p className="text-[var(--text-muted)] text-sm">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                  Business Owner
                </span>
                {user?.isVerified && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-5">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Business Profile
            </h3>

            <div className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {saved && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Settings saved successfully
                </div>
              )}

              <Input
                label="Business Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User className="w-4 h-4" />}
              />

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full bg-[var(--bg-tertiary)]/50 border border-[var(--border-primary)] rounded-xl pl-10 pr-4 py-2.5 text-[var(--text-muted)] cursor-not-allowed light-border"
                  />
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Contact support to change email
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Country
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl pl-10 pr-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 light-border"
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button onClick={handleSave} isLoading={saving}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Appearance Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5 light-border">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-[var(--text-muted)]" />
            Appearance
          </h3>
          <ThemeToggle variant="full" />
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5 light-border">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[var(--text-muted)]" />
            Notifications
          </h3>
          <div className="space-y-4">
            {[
              { title: "Rating Alerts", description: "Get notified when your products or services receive ratings", defaultChecked: true },
              { title: "Price Movement Alerts", description: "Get notified of significant price changes", defaultChecked: true },
              { title: "Weekly Reports", description: "Receive weekly performance summaries", defaultChecked: false },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[var(--text-primary)] font-medium">{item.title}</p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {item.description}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                  <div className="w-11 h-6 bg-[var(--bg-tertiary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 border border-[var(--border-primary)]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Billing Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5 light-border">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[var(--text-muted)]" />
            Billing & Subscription
          </h3>
          <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 mb-4 border border-[var(--border-primary)] light-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--text-primary)] font-medium">Free Plan</p>
                <p className="text-sm text-[var(--text-muted)]">
                  Up to 3 products, basic analytics
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm rounded-full border border-emerald-500/20">
                Active
              </span>
            </div>
          </div>
          <Button variant="secondary" className="w-full">
            Upgrade to Pro
          </Button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="rounded-2xl border border-red-500/20 bg-[var(--bg-secondary)] p-5 light-border">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Account Actions
          </h3>
          <Button
            variant="secondary"
            onClick={handleLogout}
            className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/30"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
