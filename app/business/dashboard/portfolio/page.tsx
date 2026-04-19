"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  TrendingUp,
  TrendingDown,
  Award,
  X,
  Tag,
  FileText,
  Layers,
  Image,
  Rocket,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  ExternalLink,
} from "lucide-react";
import { NpbNsbForm } from "@/components/owner/npb-nsb-form";

interface Product {
  id: number;
  name: string;
  ticker: string;
  description: string;
  category: string;
  currentPrice: string;
  priceChange: string;
  priceChangePercent: string;
  totalRatings: number;
  hasDividendBadge: boolean;
  isAdflowPromoted: boolean;
  status: string;
  itemType: 'product' | 'service' | null;
  createdAt: string;
}

const categories = [
  "Technology",
  "Food & Beverage",
  "Fashion",
  "Entertainment",
  "Health",
  "Finance",
  "Travel",
  "Home",
  "Sports",
  "General",
];

export default function PortfolioPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [promotingProduct, setPromotingProduct] = useState<Product | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [imageUrl, setImageUrl] = useState("");
  const [totalShares, setTotalShares] = useState("100000");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/owner/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/owner/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          ticker,
          description,
          category,
          imageUrl: imageUrl || null,
          totalShares: totalShares || "100000",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      setSuccess("Product IPS launched successfully!");
      setProducts((prev) => [data.product, ...prev]);

      setTimeout(() => {
        setShowAddModal(false);
        setName("");
        setTicker("");
        setDescription("");
        setCategory("General");
        setImageUrl("");
        setTotalShares("100000");
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-muted)]">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-1 flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <Package className="w-6 h-6 md:w-7 md:h-7 text-blue-400" />
            </div>
            Product / Service Portfolio
          </h1>
          <p className="text-[var(--text-muted)]">Manage your sentiment portfolio and launch new Initial Product Sentiment (IPS) listings</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
          <Rocket className="w-4 h-4" />
          Launch New IPS
        </Button>
      </motion.div>

      {/* Search & Filter */}
      {products.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 light-border"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product, index) => {
            const change = parseFloat(product.priceChange || "0");
            const isPositive = change > 0;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/product/${product.id}`}>
                  <div className="p-5 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-blue-500/30 transition-all cursor-pointer group light-border">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-blue-400 text-lg">
                            {product.ticker}
                          </span>
                          {product.hasDividendBadge && (
                            <Award className="w-4 h-4 text-amber-400" />
                          )}
                          {product.status === "ipo" && (
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                              IPS
                            </span>
                          )}
                        </div>
                        <h3 className="text-[var(--text-primary)] font-medium">
                          {product.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-[var(--text-primary)] text-xl">
                          {parseFloat(product.currentPrice).toFixed(2)}
                        </div>
                        <div
                          className={cn(
                            "flex items-center justify-end gap-1 text-sm",
                            isPositive ? "text-emerald-400" : "text-red-400"
                          )}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {isPositive && "+"}
                          {change.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <p className="text-[var(--text-muted)] text-sm line-clamp-2 mb-3">
                      {product.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-1 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-primary)] text-[var(--text-muted)]">
                        {product.category || "General"}
                      </span>
                      <span className="text-[var(--text-muted)]">{product.totalRatings} ratings</span>
                    </div>
                    {product.isAdflowPromoted && (
                      <div className="mt-3 pt-3 border-t border-[var(--border-primary)]">
                        <span className="text-xs text-amber-400 flex items-center gap-1">
                          <Rocket className="w-3 h-3" />
                          AdFLOW Promoted
                        </span>
                      </div>
                    )}
                    <div className="mt-4 pt-4 border-t border-[var(--border-primary)] flex items-center justify-between">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="text-xs flex items-center gap-1.5 h-8"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPromotingProduct(product);
                        }}
                      >
                        <Rocket className="w-3.5 h-3.5 text-emerald-400" />
                        List in Bank
                      </Button>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        ID: {product.id}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : products.length > 0 ? (
        <div className="text-center py-12 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] light-border">
          <Search className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
          <h3 className="text-[var(--text-primary)] font-medium mb-2">No products found</h3>
          <p className="text-[var(--text-muted)] text-sm">
            Try adjusting your search query
          </p>
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] light-border">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] flex items-center justify-center">
            <Package className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-[var(--text-primary)] font-medium mb-2">No products or services yet</h3>
          <p className="text-[var(--text-muted)] text-sm mb-4">
            Launch your first product or service IPS to start tracking sentiment
          </p>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Launch Your First IPS
          </Button>
        </div>
      )}

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto light-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-[var(--border-primary)] flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-blue-400" />
                    Launch Product IPS
                  </h2>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    Add a new product or service to the sentiment market
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    {success}
                  </div>
                )}

                <Input
                  label="Product Name"
                  placeholder="e.g., Apple iPhone 15"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<Package className="w-4 h-4" />}
                  required
                />

                <div>
                  <Input
                    label="Ticker Symbol"
                    placeholder="e.g., AAPL"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase().slice(0, 10))}
                    icon={<Tag className="w-4 h-4" />}
                    required
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Max 10 characters, will be uppercase
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                    Description
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-[var(--text-muted)]" />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your product..."
                      rows={3}
                      className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl pl-10 pr-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none light-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                    Category
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl pl-10 pr-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 light-border"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Input
                  label="Image URL (optional)"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  icon={<Image className="w-4 h-4" />}
                />

                <Input
                  label="Initial Share Supply"
                  placeholder="e.g., 100000"
                  type="number"
                  value={totalShares}
                  onChange={(e) => setTotalShares(e.target.value)}
                  icon={<TrendingUp className="w-4 h-4" />}
                  required
                />

                <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 border border-[var(--border-primary)] light-border">
                  <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">
                    IPS Details
                  </h4>
                  <ul className="text-sm text-[var(--text-muted)] space-y-1">
                    <li>• Starting Prodo Score: 5.00 (neutral)</li>
                    <li>• Score will adjust based on consumer ratings</li>
                    <li>• Earn Trust Dividend badge at 8.0+ for 30 days</li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    isLoading={submitting}
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Launch IPS
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Promotion Modal */}
      <AnimatePresence>
        {promotingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPromotingProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto light-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-[var(--border-primary)] flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-emerald-400" />
                    Market Launch Center
                  </h2>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    Advertise your product in the New Products & Services Bank
                  </p>
                </div>
                <button
                  onClick={() => setPromotingProduct(null)}
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <NpbNsbForm 
                  product={promotingProduct} 
                  onCancel={() => setPromotingProduct(null)}
                  onSuccess={() => {
                    fetchProducts(); // Refresh to show promoted status
                    // Modal auto-closes after success delay in form component
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
