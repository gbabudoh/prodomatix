"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/shared/card";
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
    <div className="p-6 md:p-8 pb-24 md:pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-gray-400" />
          Settings
        </h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card>
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-800">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-gray-400 text-sm">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
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

          <h3 className="text-lg font-semibold text-white mb-4">
            Business Profile
          </h3>

          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {saved && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
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
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full bg-gray-800/30 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Contact support to change email
              </p>
            </div>

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

            <Button onClick={handleSave} isLoading={saving}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Appearance Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-gray-400" />
            Appearance
          </h3>
          <ThemeToggle variant="full" />
        </Card>
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-400" />
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-white">Rating Alerts</p>
                <p className="text-sm text-gray-500">
                  Get notified when your products receive ratings
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-white">Price Movement Alerts</p>
                <p className="text-sm text-gray-500">
                  Get notified of significant price changes
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-white">Weekly Reports</p>
                <p className="text-sm text-gray-500">
                  Receive weekly performance summaries
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Billing Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-400" />
            Billing & Subscription
          </h3>
          <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Free Plan</p>
                <p className="text-sm text-gray-500">
                  Up to 3 products, basic analytics
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full">
                Active
              </span>
            </div>
          </div>
          <Button variant="secondary" className="w-full">
            Upgrade to Pro
          </Button>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-red-500/20">
          <h3 className="text-lg font-semibold text-white mb-4">
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
        </Card>
      </motion.div>
    </div>
  );
}
