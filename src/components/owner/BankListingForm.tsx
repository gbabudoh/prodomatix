"use client";

import { useState } from "react";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import {
  Package,
  Layers,
  FileText,
  Image as ImageIcon,
  Rocket,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  MapPin,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BankListingFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function BankListingForm({ onSuccess, onCancel }: BankListingFormProps) {
  const [listingType, setListingType] = useState<"npb" | "nsb">("npb");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [purchaseLocation, setPurchaseLocation] = useState("");
  const [sentimentDiscount, setSentimentDiscount] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/npb-nsb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          imageUrl,
          listingType,
          purchaseLocation,
          sentimentDiscount,
          externalUrl,
          shortDescription: description,
          featuredImage: imageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create listing");
      }

      setSuccess("Your " + (listingType === 'npb' ? 'product' : 'service') + " has been listed in the Bank! 🚀");
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          {success}
        </div>
      )}

      {/* Listing Type Toggle */}
      <div className="flex p-1 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-primary)] w-fit">
        <button
          type="button"
          onClick={() => setListingType("npb")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
            listingType === "npb"
              ? "bg-blue-500 text-white shadow-lg"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          )}
        >
          <Package className="w-4 h-4" />
          New Product (NPB)
        </button>
        <button
          type="button"
          onClick={() => setListingType("nsb")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
            listingType === "nsb"
              ? "bg-emerald-500 text-white shadow-lg"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          )}
        >
          <Layers className="w-4 h-4" />
          New Service (NSB)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Input
            label={listingType === "npb" ? "Product Name" : "Service Name"}
            placeholder={listingType === "npb" ? "e.g., UltraWidget Pro" : "e.g., Cloud Hosting Plus"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<Tag className="w-4 h-4" />}
            required
          />

          <Input
            label="Visual / Image URL"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            icon={<ImageIcon className="w-4 h-4" />}
            required
          />

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              {listingType === "npb" ? "Product Description" : "Service Description"}
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-[var(--text-muted)]" />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give a brief summary of what you are promoting..."
                rows={4}
                required
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl pl-10 pr-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none light-border"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Where to Buy"
            placeholder="e.g., Amazon, Official Store, App Store"
            value={purchaseLocation}
            onChange={(e) => setPurchaseLocation(e.target.value)}
            icon={<MapPin className="w-4 h-4" />}
            required
          />

          <Input
            label="Sentiment Discount"
            placeholder="e.g., 20% OFF for community reviewers"
            value={sentimentDiscount}
            onChange={(e) => setSentimentDiscount(e.target.value)}
            icon={<AlertCircle className="w-4 h-4 text-amber-400" />}
            required
          />
          <p className="text-[10px] text-amber-400/80 mt-[-8px]">
            * Mandatory for consumer review anchoring
          </p>

          <Input
            label="External Company Link"
            placeholder="https://yourbusiness.com/landing-page"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            icon={<ExternalLink className="w-4 h-4" />}
            required
          />

          <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-2">
            <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Direct Bank Submission
            </h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Your {listingType === 'npb' ? 'product' : 'service'} will be listed directly in the **{listingType.toUpperCase()} Hub** for 30 days. This will also create a placeholder IPS entry in your portfolio.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-[var(--border-primary)]">
        <Button
          type="button"
          variant="ghost"
          className="flex-1"
          onClick={onCancel}
          disabled={loading}
        >
          Discard
        </Button>
        <Button
          type="submit"
          className="flex-1"
          isLoading={loading}
        >
          Create Bank Listing
        </Button>
      </div>
    </form>
  );
}
