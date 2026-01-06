
"use client";

import React, { useState } from "react";
import { 
  Package, Plus, MoreVertical, Star, Link as LinkIcon, X, Save, 
  Image as ImageIcon, Trash2, Edit2, Sparkles, ChevronRight, 
  ThumbsUp, ThumbsDown, Info
} from "lucide-react";
import { createProductAction, updateProductAction, deleteProductAction, requestProductSummaryAction } from "@/app/actions";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  imageUrl: string | null;
  aiSummary: string | null;
  avgRating: string;
  reviewCount: number;
}

export default function ProductList({ initialProducts }: { initialProducts: Product[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState<Product | null>(null);
  const [isSummarizing, setIsSummarizing] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    imageUrl: ""
  });

  const resetForm = () => {
    setFormData({ name: "", sku: "", description: "", imageUrl: "" });
    setSelectedProduct(null);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      description: product.description || "",
      imageUrl: product.imageUrl || ""
    });
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product? All associated reviews will remain but will be orphaned.")) return;
    try {
      await deleteProductAction(productId);
      setActiveMenu(null);
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let result;
      if (selectedProduct) {
        result = await updateProductAction(selectedProduct.id, formData);
      } else {
        result = await createProductAction(formData);
      }
      
      if (result.success) {
        setIsModalOpen(false);
        resetForm();
      } else {
        alert(result.error || "Operation failed");
      }
    } catch (error) {
      console.error("Product Action Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateSummary = async (productId: string) => {
    setIsSummarizing(productId);
    try {
      const result = await requestProductSummaryAction(productId);
      if (!result.success) {
        alert(result.error);
      }
    } catch (error) {
      console.error("Summary error:", error);
    } finally {
      setIsSummarizing(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Product Inventory</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Manage your product catalog and view aggregate rating health.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {initialProducts.map((product) => (
          <div key={product.id} className="group relative rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start justify-between">
              <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                <Package className="h-6 w-6" />
              </div>
              <div className="relative">
                <button 
                  onClick={() => setActiveMenu(activeMenu === product.id ? null : product.id)}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
                {activeMenu === product.id && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-200 bg-white py-1 shadow-xl z-20 dark:border-zinc-800 dark:bg-zinc-900">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" /> Edit Details
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" /> Delete Product
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{product.name}</h3>
              <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{product.description || "No description provided."}</p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{product.avgRating}</span>
                <span className="text-xs text-zinc-400">({product.reviewCount} Reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md">
                <LinkIcon className="h-3 w-3" />
                Connected
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Link 
                href={`/dashboard/reviews?productId=${product.id}`}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 cursor-pointer transition-all"
              >
                View Reviews <ChevronRight className="h-3 w-3" />
              </Link>
              <button 
                onClick={() => {
                  if (product.aiSummary) {
                    setShowSummary(product);
                  } else {
                    handleGenerateSummary(product.id);
                  }
                }}
                disabled={isSummarizing === product.id}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-indigo-50 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 cursor-pointer transition-all disabled:opacity-50"
              >
                {isSummarizing === product.id ? (
                  <Sparkles className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                {product.aiSummary ? "AI Insights" : "Synthesize AI"}
              </button>
            </div>
          </div>
        ))}

        {initialProducts.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-200 rounded-xl dark:border-zinc-800">
            <Package className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
            <p className="text-zinc-500">No products found. Start by adding your first product.</p>
          </div>
        )}
      </div>

      {/* Slide-over for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-zinc-950/20 backdrop-blur-md transition-all duration-500">
           {/* Click overlay to close */}
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative h-full w-full max-w-xl bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] animate-in slide-in-from-right duration-500 ease-out dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 flex flex-col">
            <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {selectedProduct ? "Edit Product" : "Add New Product"}
                    </h2>
                    <p className="text-xs text-zinc-500">
                        {selectedProduct ? `Updating ${selectedProduct.name}` : "Register a new product in your catalog"}
                    </p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer">
                   <X className="h-5 w-5" />
                </button>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Product Name</label>
                        <input 
                            required
                            type="text"
                            placeholder="e.g., Ultra Widget Pro"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full rounded-xl border border-zinc-200 bg-white p-4 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">SKU / Identifier</label>
                        <input 
                            required
                            type="text"
                            placeholder="e.g., UWP-9000-X"
                            value={formData.sku}
                            onChange={(e) => setFormData({...formData, sku: e.target.value})}
                            className="w-full rounded-xl border border-zinc-200 bg-white p-4 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Image URL</label>
                        <div className="relative group">
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <input 
                                type="url"
                                placeholder="https://..."
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                                className="w-full rounded-xl border border-zinc-200 bg-white pl-12 pr-4 py-4 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">Description</label>
                        <textarea 
                            rows={4}
                            placeholder="Briefly describe the product features..."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full rounded-xl border border-zinc-200 bg-white p-4 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 resize-none transition-all"
                        />
                    </div>
                </div>
            </form>

            <div className="px-8 py-8 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/50 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                >
                    Cancel
                </button>
                <button 
                   onClick={handleCreateOrUpdate}
                   disabled={!formData.name || !formData.sku || isSubmitting}
                   className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-xl hover:bg-indigo-500 disabled:opacity-50 transition-all active:translate-y-0.5 cursor-pointer"
                >
                    {isSubmitting ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    {isSubmitting ? "Processing..." : selectedProduct ? "Update Product" : "Save Product"}
                </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">AI Product Intelligence</h2>
                            <p className="text-xs text-zinc-500 capitalize">{showSummary.name}</p>
                        </div>
                    </div>
                    <button onClick={() => setShowSummary(null)} className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {(() => {
                        const summary = JSON.parse(showSummary.aiSummary || "{}");
                        return (
                            <div className="grid gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-emerald-600">
                                        <ThumbsUp className="h-4 w-4" />
                                        <h4 className="text-sm font-bold uppercase tracking-widest">Strengths</h4>
                                    </div>
                                    <div className="grid gap-2">
                                        {(summary.pros || []).map((pro: string, i: number) => (
                                            <div key={i} className="flex items-start gap-3 rounded-xl bg-emerald-50/50 p-4 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/30">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                                <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">{pro}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-rose-600">
                                        <ThumbsDown className="h-4 w-4" />
                                        <h4 className="text-sm font-bold uppercase tracking-widest">Friction Points</h4>
                                    </div>
                                    <div className="grid gap-2">
                                        {(summary.cons || []).map((con: string, i: number) => (
                                            <div key={i} className="flex items-start gap-3 rounded-xl bg-rose-50/50 p-4 dark:bg-rose-950/10 border border-rose-100/50 dark:border-rose-900/30">
                                                <div className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                                                <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">{con}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4 rounded-2xl bg-indigo-600 p-6 text-white shadow-lg shadow-indigo-600/20">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Info className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Strategy Verdict</span>
                                    </div>
                                    <p className="text-lg font-bold leading-relaxed">{summary.verdict}</p>
                                </div>
                            </div>
                        );
                    })()}
                </div>

                <div className="px-8 py-6 border-t border-zinc-100 dark:border-zinc-900 flex justify-end">
                    <button 
                        onClick={() => setShowSummary(null)}
                        className="rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer transition-all"
                    >
                        Close Insights
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
