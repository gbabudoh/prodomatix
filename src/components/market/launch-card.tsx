"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  Rocket, 
  ExternalLink, 
  Tag, 
  ArrowRight, 
  Sparkles,
  ShoppingBag,
  Gem,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { trackAction } from "@/lib/tracking-client";

interface LaunchCardProps {
  listing: {
    id: number;
    listingType: 'npb' | 'nsb';
    featuredImage: string | null;
    shortDescription: string | null;
    purchaseLocation: string | null;
    sentimentDiscount: string | null;
    discountCode: string | null;
    externalUrl: string | null;
    product: {
      id: number;
      name: string;
      ticker: string;
      category: string | null;
      brandName: string | null;
    };
  };
  index?: number;
}

export function LaunchCard({ listing, index = 0 }: LaunchCardProps) {
  const isProduct = listing.listingType === 'npb';

  const handleTrackClick = () => {
    trackAction(listing.product.id, 'click', { metadata: { type: listing.listingType } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="relative group h-full"
    >
      <div className={cn(
        "relative flex flex-col h-full rounded-2xl border overflow-hidden transition-all duration-500",
        "bg-[var(--bg-secondary)] border-[var(--border-primary)]",
        "hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10",
        "group-hover:-translate-y-1"
      )}>
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />

        {/* Listing Type Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
          {isProduct ? (
            <>
              <Rocket className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">New Product</span>
            </>
          ) : (
            <>
              <Gem className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">New Service</span>
            </>
          )}
        </div>

        {/* Sentiment Discount Badge */}
        {listing.sentimentDiscount && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/20 animate-pulse">
            <Tag className="w-3.5 h-3.5 fill-current" />
            <span className="text-[10px] font-extrabold uppercase">{listing.sentimentDiscount} Discount</span>
          </div>
        )}

        {/* Hero Section */}
        <div className="relative aspect-video overflow-hidden bg-[var(--bg-tertiary)] flex items-center justify-center">
          {listing.featuredImage ? (
            <img 
              src={listing.featuredImage} 
              alt={listing.product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 opacity-20 transition-opacity group-hover:opacity-40">
              <Sparkles className="w-12 h-12 text-emerald-500" />
              <span className="text-4xl font-mono font-black text-emerald-500">{listing.product.ticker}</span>
            </div>
          )}
          
          {/* External Link Overlay */}
          {listing.externalUrl && (
            <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
               <a 
                href={listing.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-black font-bold text-xs rounded-xl hover:bg-emerald-50 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Official Site <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {listing.product.ticker}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">
              {listing.product.brandName || "Premium Release"}
            </span>
          </div>

          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-emerald-400 transition-colors">
            {listing.product.name}
          </h3>

          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4 leading-relaxed">
            {listing.shortDescription || "Limited edition launch. Join the discovery and share your sentiment to unlock exclusive discounts."}
          </p>

          <div className="mt-auto space-y-4">
            {/* CTA Section */}
            <div className="flex items-center gap-3">
              <Link 
                href={`/product/${listing.product.id}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] font-bold text-xs rounded-xl hover:border-emerald-500/50 transition-all"
                onClick={handleTrackClick}
              >
                Discover <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              
              {listing.purchaseLocation && (
                <a 
                  href={listing.purchaseLocation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all"
                  title="Where to Buy"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ShoppingBag className="w-4 h-4" />
                </a>
              )}
            </div>
            
            <div className="flex items-center justify-center">
              <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Rate to reveal {listing.sentimentDiscount} discount code
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
