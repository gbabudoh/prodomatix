"use client";

import { useThemeStore, type ThemeMode } from "@/store/theme-store";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "icon" | "full" | "select";
  className?: string;
}

export function ThemeToggle({ variant = "icon", className }: ThemeToggleProps) {
  const { theme, setTheme, toggleTheme } = useThemeStore();

  if (variant === "icon") {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          "p-2 rounded-lg transition-colors cursor-pointer",
          "text-gray-400 hover:text-white hover:bg-gray-800/50",
          "dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/50",
          "light:text-gray-600 light:hover:text-gray-900 light:hover:bg-gray-200/50",
          className
        )}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    );
  }

  if (variant === "select") {
    return (
      <div className={cn("flex gap-2", className)}>
        <ThemeOption
          mode="light"
          label="Light"
          icon={<Sun className="w-4 h-4" />}
          isActive={theme === "light"}
          onClick={() => setTheme("light")}
        />
        <ThemeOption
          mode="dark"
          label="Dark"
          icon={<Moon className="w-4 h-4" />}
          isActive={theme === "dark"}
          onClick={() => setTheme("dark")}
        />
      </div>
    );
  }

  // Full variant with labels
  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 light:text-gray-700">
        Theme
      </label>
      <div className="grid grid-cols-2 gap-3">
        <ThemeCard
          mode="light"
          label="Light Mode"
          description="Off-white with gradients"
          icon={<Sun className="w-5 h-5" />}
          isActive={theme === "light"}
          onClick={() => setTheme("light")}
        />
        <ThemeCard
          mode="dark"
          label="Dark Mode"
          description="Dark with emerald accents"
          icon={<Moon className="w-5 h-5" />}
          isActive={theme === "dark"}
          onClick={() => setTheme("dark")}
        />
      </div>
    </div>
  );
}

function ThemeOption({
  mode,
  label,
  icon,
  isActive,
  onClick,
}: {
  mode: ThemeMode;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer",
        isActive
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600 dark:bg-gray-800/50 dark:text-gray-400 light:bg-gray-100 light:text-gray-600 light:border-gray-300"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function ThemeCard({
  mode,
  label,
  description,
  icon,
  isActive,
  onClick,
}: {
  mode: ThemeMode;
  label: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-4 rounded-xl text-left transition-all cursor-pointer",
        isActive
          ? "bg-emerald-500/10 border-2 border-emerald-500 ring-2 ring-emerald-500/20"
          : "bg-gray-800/50 border-2 border-gray-700 hover:border-gray-600 dark:bg-gray-800/50 light:bg-gray-100 light:border-gray-300 light:hover:border-gray-400"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
          isActive
            ? "bg-emerald-500/20 text-emerald-400"
            : "bg-gray-700/50 text-gray-400 dark:bg-gray-700/50 light:bg-gray-200 light:text-gray-600"
        )}
      >
        {icon}
      </div>
      <h4
        className={cn(
          "font-medium mb-1",
          isActive
            ? "text-emerald-400"
            : "text-white dark:text-white light:text-gray-900"
        )}
      >
        {label}
      </h4>
      <p className="text-xs text-gray-500 dark:text-gray-500 light:text-gray-500">
        {description}
      </p>
      {/* Theme preview */}
      <div
        className={cn(
          "mt-3 h-12 rounded-lg overflow-hidden border",
          mode === "dark"
            ? "bg-gray-950 border-gray-800"
            : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
        )}
      >
        <div className="flex h-full">
          <div
            className={cn(
              "w-1/4 h-full",
              mode === "dark" ? "bg-gray-900" : "bg-white"
            )}
          />
          <div className="flex-1 p-1.5 flex flex-col gap-1">
            <div
              className={cn(
                "h-2 w-3/4 rounded",
                mode === "dark" ? "bg-gray-800" : "bg-gray-200"
              )}
            />
            <div
              className={cn(
                "h-2 w-1/2 rounded",
                mode === "dark" ? "bg-emerald-500/30" : "bg-emerald-500/40"
              )}
            />
          </div>
        </div>
      </div>
    </button>
  );
}
