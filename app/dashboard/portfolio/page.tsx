"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared/card";
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
} from "lucide-react";

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

  // Form state
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [imageUrl, setImageUrl] = useState("");

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
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      setSuccess("Product IPO launched successfully!");
      setProducts((prev) => [data.product, ...prev]);

      // Reset form
      setTimeout(() => {
        setShowAddModal(false);
        setName("");
        setTicker("");
        setDescription("");
        setCategory("General");
        setImageUrl("");
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Package className="w-8 h-8 text-emerald-400" />
            Product Portfolio
          </h1>
          <p className="text-gray-400">Manage your products and launch new IPOs</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New IPO
        </Button>
      </motion.div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, index) => {
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
                  <Card hover className="h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-400 text-lg">
                            {product.ticker}
                          </span>
                          {product.hasDividendBadge && (
                            <Award className="w-4 h-4 text-emerald-400" />
                          )}
                          {product.status === "ipo" && (
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                              IPO
                            </span>
                          )}
                        </div>
                        <h3 className="text-white font-medium mt-1">
                          {product.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-white text-xl">
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
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                      {product.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="px-2 py-1 bg-gray-800 rounded">
                        {product.category || "General"}
                      </span>
                      <span>{product.totalRatings} prodo ratings</span>
                    </div>
                    {product.isAdflowPromoted && (
                      <div className="mt-3 pt-3 border-t border-gray-800">
                        <span className="text-xs text-yellow-400 flex items-center gap-1">
                          <Rocket className="w-3 h-3" />
                          AdFLOW Promoted
                        </span>
                      </div>
                    )}
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">No products yet</h3>
          <p className="text-gray-500 text-sm mb-4">
            Launch your first product IPO to start tracking sentiment
          </p>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Launch Your First IPO
          </Button>
        </Card>
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
              className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-emerald-400" />
                    Launch Product IPO
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Add a new product to the sentiment market
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
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

                <Input
                  label="Ticker Symbol"
                  placeholder="e.g., AAPL"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase().slice(0, 10))}
                  icon={<Tag className="w-4 h-4" />}
                  required
                />
                <p className="text-xs text-gray-500 -mt-2">
                  Max 10 characters, will be uppercase
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your product..."
                      rows={3}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
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

                <div className="bg-gray-800/50 rounded-lg p-4 mt-4">
                  <h4 className="text-sm font-medium text-white mb-2">
                    IPO Details
                  </h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Starting Prodo Score: 5.00 (neutral)</li>
                    <li>• Score will adjust based on consumer prodo ratings</li>
                    <li>• Earn Trust Dividend badge at 8.0+ for 30 days</li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-4">
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
                    Launch IPO
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
