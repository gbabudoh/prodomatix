import React from 'react';
import { AlertCircle, ShieldAlert, ZapOff, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MarketAlertProps {
  type: 'freeze' | 'bombing' | 'delisted' | 'info';
  productName: string;
  reason?: string;
}

export function MarketAlert({ type, productName, reason }: MarketAlertProps) {
  const configs = {
    freeze: {
      icon: ZapOff,
      title: "Market Halt",
      color: "red",
      message: `Trading for ${productName} has been temporarily frozen due to suspicious rating activity.`
    },
    bombing: {
      icon: ShieldAlert,
      title: "Volatility Warning",
      color: "orange",
      message: `Coordinated sentiment attacks detected for ${productName}. Volatility brakes are active.`
    },
    delisted: {
      icon: AlertCircle,
      title: "IPS Delisted",
      color: "gray",
      message: `${productName} has been removed from the platform for multi-violation market manipulation.`
    },
    info: {
      icon: Info,
      title: "Under Audit",
      color: "blue",
      message: `The Prodomatix Audit bot is currently verifying recent sentiment spikes for ${productName}.`
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 rounded-2xl border flex gap-4 items-start shadow-lg",
        type === 'freeze' ? "bg-red-500/10 border-red-500/20 text-red-500" :
        type === 'bombing' ? "bg-orange-500/10 border-orange-500/20 text-orange-400" :
        type === 'delisted' ? "bg-gray-500/10 border-gray-500/20 text-gray-400" :
        "bg-blue-500/10 border-blue-500/20 text-blue-400"
      )}
    >
      <div className={cn(
        "p-2 rounded-xl flex-shrink-0 bg-white/5",
        type === 'freeze' ? "text-red-500" :
        type === 'bombing' ? "text-orange-400" :
        "text-blue-400"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-black uppercase tracking-tighter text-sm mb-1">{config.title}</h4>
        <p className="text-xs opacity-90 leading-relaxed font-medium">
          {config.message}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] py-0.5 px-2 bg-black/20 rounded-full font-bold uppercase">Compliance Alert</span>
          <span className="text-[10px] opacity-60">Ref: IDX-2026-MARKET</span>
        </div>
      </div>
    </motion.div>
  );
}
