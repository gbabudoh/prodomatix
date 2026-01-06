
"use client";

import React, { useState } from "react";
import { Star, ShoppingCart, ShieldCheck, Truck, RefreshCw, Heart } from "lucide-react";
import Script from "next/script";

interface StoreFrontProps {
  productId: string;
}

export default function StoreFront({ productId }: StoreFrontProps) {
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-12 lg:flex-row">
      <div className="flex-1 space-y-6">
        {/* Gallery Mock */}
        <div className="aspect-square w-full rounded-3xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <span className="text-zinc-400 font-bold uppercase tracking-widest text-sm">Product Preview Image</span>
            <div className="absolute bottom-6 left-6 right-6 flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 w-16 rounded-xl border-2 border-white/50 bg-zinc-300 dark:bg-zinc-700 shadow-lg"></div>
                ))}
            </div>
        </div>
      </div>

      <div className="flex-1 space-y-8">
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                    <ShieldCheck className="h-3 w-3" />
                    Official Vendor
                </div>
                <span className="text-xs text-zinc-400 font-medium">SKU: PRO-SANDBOX-001</span>
            </div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 lg:text-5xl">
            Prodomatix Hyperion <span className="text-indigo-600 italic">v2</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
            </div>
            <span className="text-sm font-bold text-zinc-500 hover:text-indigo-600 cursor-pointer underline underline-offset-4 decoration-zinc-200">
                124 Reviews
            </span>
          </div>
          <p className="text-3xl font-black text-zinc-900 dark:text-zinc-50">$299.00</p>
        </div>

        <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
          Experience the pinnacle of engineering with the Hyperion v2. Designed for those who demand excellence in every detail. 
          Limited edition release with carbon fiber accents and titanium structural support.
        </p>

        <div className="space-y-6 border-t border-zinc-100 pt-6 dark:border-zinc-800">
            <div>
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 block mb-3">Select Size</label>
                <div className="flex gap-3">
                    {["S", "M", "L", "XL"].map((size) => (
                        <button 
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`h-12 w-16 rounded-xl border font-bold text-sm transition-all ${
                                selectedSize === size 
                                ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900" 
                                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex h-14 w-full items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 dark:border-zinc-800 dark:bg-zinc-900 sm:w-32">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-zinc-400 hover:text-zinc-900">-</button>
                    <span className="font-bold">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-zinc-400 hover:text-zinc-900">+</button>
                </div>
                <button className="flex h-14 w-full flex-1 items-center justify-center gap-3 rounded-xl bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-[0.98]">
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                </button>
                <button className="flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 transition-all">
                    <Heart className="h-5 w-5" />
                </button>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-indigo-600" />
                <div>
                    <p className="text-xs font-bold">Free Shipping</p>
                    <p className="text-[10px] text-zinc-500">Global Priority Delivery</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-indigo-600" />
                <div>
                    <p className="text-xs font-bold">30-Day Returns</p>
                    <p className="text-[10px] text-zinc-500">Easy hassle-free returns</p>
                </div>
            </div>
        </div>

        {/* PRODOMATIX WIDGET INJECTION */}
        <div className="mt-20 pt-12 border-t border-zinc-100 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-8">Customer Feedback</h2>
            <div 
                id="prodomatix-reviews" 
                data-product-id={productId}
                className="min-h-[400px]"
            >
                {/* Loader Placeholder */}
                <div className="flex flex-col items-center justify-center p-20 text-zinc-400 text-sm">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-indigo-600 mb-4" />
                    Fetching authenticated reviews...
                </div>
            </div>
        </div>
        
        <Script src="/widget.js" strategy="afterInteractive" />
      </div>
    </div>
  );
}
