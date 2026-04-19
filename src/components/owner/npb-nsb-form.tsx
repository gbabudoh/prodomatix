"use client";

import { useState } from "react";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { cn } from "@/lib/utils";
import { 
  Rocket, 
  Tag, 
  Globe, 
  ShoppingBag, 
  Image as ImageIcon,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface NpbNsbFormProps {
  product: {
    id: number;
    name: string;
    ticker: string;
    itemType: string | null;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NpbNsbForm({ product, onSuccess, onCancel }: NpbNsbFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    featuredImage: "",
    shortDescription: "",
    purchaseLocation: "",
    sentimentDiscount: "",
    discountCode: "",
    externalUrl: "",
    durationDays: 30,
  });

  const isService = product.itemType === 'service';
  const listingType = isService ? 'nsb' : 'npb';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/npb-nsb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          listingType,
          ...formData,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        if (onSuccess) setTimeout(onSuccess, 2000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create listing");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 text-center bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Launch Scheduled!</h3>
        <p className="text-emerald-400/80 text-sm">
          Your {isService ? 'service' : 'product'} will now appear in the {listingType.toUpperCase()} Bank.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-primary)] mb-6">
        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
          <Rocket className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-bold text-white">{product.name} ({product.ticker})</h3>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
            Promoting in {listingType.toUpperCase()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2 flex items-center gap-2">
              <ImageIcon className="w-3 h-3" /> Featured Image URL
            </label>
            <Input 
              placeholder="https://..."
              value={formData.featuredImage}
              onChange={(e) => setFormData({...formData, featuredImage: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2 flex items-center gap-2">
               Short Description
            </label>
            <textarea 
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[100px]"
              placeholder="Hook your audience in 2 sentences..."
              value={formData.shortDescription}
              onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2 flex items-center gap-2">
              <Tag className="w-3 h-3" /> Sentiment Discount (e.g. 20%)
            </label>
            <Input 
              placeholder="How much discount for a rating?"
              value={formData.sentimentDiscount}
              onChange={(e) => setFormData({...formData, sentimentDiscount: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2">
              Discount Code
            </label>
            <Input 
              placeholder="PRODO-LOVE-20"
              value={formData.discountCode}
              onChange={(e) => setFormData({...formData, discountCode: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2 flex items-center gap-2">
              <ShoppingBag className="w-3 h-3" /> Purchase Location URL
            </label>
            <Input 
              placeholder="Shop link or store page"
              value={formData.purchaseLocation}
              onChange={(e) => setFormData({...formData, purchaseLocation: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2 flex items-center gap-2">
              <Globe className="w-3 h-3" /> Company External Page
            </label>
            <Input 
              placeholder="Your official website URL"
              value={formData.externalUrl}
              onChange={(e) => setFormData({...formData, externalUrl: e.target.value})}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-primary)]">
        <Button variant="secondary" className="flex-1" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600" isLoading={loading} type="submit">
          Launch in Bank
        </Button>
      </div>
    </form>
  );
}
