"use client";

import { cn } from "@/lib/utils";
import { useState, useCallback, type InputHTMLAttributes } from "react";

interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  showValue?: boolean;
  showLabel?: boolean;
  colorScale?: boolean;
}

export function Slider({
  label,
  value,
  min = 1,
  max = 10,
  step = 1,
  onChange,
  showValue = true,
  showLabel = true,
  colorScale = true,
  className,
  ...props
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  const getColor = useCallback((val: number) => {
    if (val <= 3) return "from-red-500 to-red-400";
    if (val <= 5) return "from-orange-500 to-yellow-400";
    if (val <= 7) return "from-yellow-400 to-emerald-400";
    return "from-emerald-400 to-emerald-500";
  }, []);

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <label className="text-sm font-medium text-[var(--text-secondary)]">{label}</label>
          )}
          {showValue && (
            <span
              className={cn(
                "text-sm font-bold tabular-nums font-mono",
                value <= 3 && "text-red-400",
                value > 3 && value <= 5 && "text-orange-400",
                value > 5 && value <= 7 && "text-yellow-400",
                value > 7 && "text-emerald-400"
              )}
            >
              {value}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <div className="h-2.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden border border-[var(--border-primary)]">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-150 bg-gradient-to-r",
              colorScale ? getColor(value) : "from-emerald-500 to-teal-500"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          {...props}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-[var(--bg-primary)] pointer-events-none transition-all duration-150"
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-[var(--text-muted)]">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}
