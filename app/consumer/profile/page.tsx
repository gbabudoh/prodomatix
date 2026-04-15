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
  User,
  Mail,
  Globe,
  Calendar,
  Shield,
  LogOut,
  Save,
  CheckCircle,
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

export default function ProfilePage() {
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

  return (
    <div className="p-6 md:p-8 pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <User className="w-8 h-8 text-emerald-400" />
          Profile
        </h1>
        <p className="text-gray-400">Manage your account settings</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card>
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-800">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <span className="text-emerald-400 font-bold text-2xl">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-gray-400 text-sm">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                  Consumer
                </span>
                {user?.isVerified && (
                  <span className="flex items-center gap-1 text-xs text-blue-400">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {saved && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Profile updated successfully
              </div>
            )}

            <Input
              label="Full Name"
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
                Email cannot be changed
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

            <Button
              onClick={handleSave}
              isLoading={saving}
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Appearance */}
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

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">
            Account Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                Member Since
              </div>
              <span className="text-white">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <div className="flex items-center gap-2 text-gray-400">
                <Shield className="w-4 h-4" />
                Account Status
              </div>
              <span className="text-emerald-400">Active</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-red-500/20">
          <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
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
