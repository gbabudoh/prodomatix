
"use client";

import React, { useState } from "react";
import { Search, Star, ExternalLink, ShieldCheck, X, Sparkles, Send } from "lucide-react";
import { generateReplyAction, saveResponseAction } from "@/app/actions";

interface Review {
  id: string;
  reviewerName: string | null;
  rating: number;
  content: string;
  sentiment: string | null;
  createdAt: string;
  product: { name: string } | null;
  retailer: { name: string | null } | null;
  manufacturerResponse: string | null;
}

export default function ReviewList({ initialReviews }: { initialReviews: Review[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("All Sources");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Derive unique sources
  const sources = ["All Sources", "Direct Site", ...new Set(initialReviews.map(r => r.retailer?.name).filter(Boolean) as string[])];

  const filteredReviews = initialReviews.filter(r => {
    const matchesSearch = r.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.reviewerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.product?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const sourceName = r.retailer?.name || "Direct Site";
    const matchesSource = selectedSource === "All Sources" || sourceName === selectedSource;

    return matchesSearch && matchesSource;
  });

  const handleGenerateReply = async (review: Review) => {
    setIsGenerating(true);
    try {
      const reply = await generateReplyAction(
        review.content ?? "",
        review.rating ?? 0,
        review.reviewerName ?? "Customer"
      );
      setReplyText(reply);
    } catch (error) {
       console.error("AI Reply Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveResponse = async () => {
    if (!selectedReview || !replyText) return;
    setIsGenerating(true);
    try {
      const result = await saveResponseAction(selectedReview.id, replyText);
      if (result.success) {
        setSelectedReview(null);
        setReplyText("");
      } else {
        alert("Failed to save response. Please try again.");
      }
    } catch (error) {
      console.error("Save Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Review Management</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Monitor, moderate, and respond to customer feedback across all channels.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search reviews..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-64 rounded-lg border border-zinc-200 bg-white pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
            />
          </div>
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
             {sources.map(source => (
               <button 
                 key={source}
                 onClick={() => setSelectedSource(source)}
                 className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                   selectedSource === source 
                   ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50" 
                   : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                 }`}
               >
                 {source}
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Needs Response", value: initialReviews.filter(r => !r.manufacturerResponse && r.rating < 4).length, color: "text-rose-600" },
          { label: "Flagged (AI)", value: 0, color: "text-amber-600" },
          { label: "Live Syndicated", value: initialReviews.length, color: "text-emerald-600" },
          { label: "Total Volume", value: initialReviews.length, color: "text-zinc-900" }
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.color} dark:text-zinc-100`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400">
            <tr>
              <th className="px-6 py-4 font-medium">Reviewer</th>
              <th className="px-6 py-4 font-medium">Product & Rating</th>
              <th className="px-6 py-4 font-medium">Content</th>
              <th className="px-6 py-4 font-medium">Source</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredReviews.map((review) => (
              <tr key={review.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{review.reviewerName || "Anonymous"}</span>
                    <span className="text-xs text-zinc-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{review.product?.name}</span>
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 fill-current ${i < review.rating ? "text-amber-400" : "text-zinc-200 dark:text-zinc-700"}`} />
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 max-w-md">
                   <div className="flex flex-col">
                    <span className="line-clamp-2 text-zinc-600 dark:text-zinc-300 italic">&quot; {review.content} &quot;</span>
                    {review.sentiment === "positive" && (
                      <span className="mt-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                        <ShieldCheck className="h-3 w-3" /> AI Validated
                      </span>
                    )}
                   </div>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => setSelectedSource(review.retailer?.name || "Direct Site")}
                    className="flex items-center gap-2 group cursor-pointer"
                  >
                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 border-b border-transparent group-hover:border-indigo-600/30 transition-all">
                        {review.retailer?.name || "Direct Site"}
                    </span>
                    <ExternalLink className="h-3 w-3 text-zinc-300 group-hover:text-indigo-600 transition-colors" />
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                   <button 
                    onClick={() => {
                        setSelectedReview(review);
                        setReplyText(review.manufacturerResponse || "");
                    }}
                    className="rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 cursor-pointer"
                   >
                      {review.manufacturerResponse ? "View Reply" : "Respond"}
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Response Slide-over / Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-zinc-950/20 backdrop-blur-md transition-all duration-500">
          <div className="h-full w-full max-w-xl bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] animate-in slide-in-from-right duration-500 ease-out dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 flex flex-col">
             
             {/* Modal Header */}
             <div className="relative px-8 py-6 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Draft Response</h2>
                    <p className="text-xs font-medium text-zinc-500 flex items-center gap-1.5 capitalize">
                       <span className={`inline-block h-2 w-2 rounded-full ${selectedReview.sentiment === 'positive' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                       {selectedReview.sentiment} Sentiment
                    </p>
                </div>
                <button 
                    onClick={() => setSelectedReview(null)} 
                    className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                   <X className="h-5 w-5" />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
                {/* Customer Review Card */}
                <div className="relative">
                    <div className="absolute -left-3 top-4 h-6 w-6 rotate-45 border-l border-t border-indigo-100 bg-indigo-50/30 dark:border-indigo-900/30 dark:bg-indigo-900/10"></div>
                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-6 dark:border-indigo-900/30 dark:bg-indigo-900/10">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                    {(selectedReview.reviewerName || "A")[0]}
                                </div>
                                <div>
                                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{selectedReview.reviewerName || "Anonymous"}</h4>
                                    <div className="flex text-amber-400 mt-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={`h-3 w-3 fill-current ${i < selectedReview.rating ? "text-amber-400" : "text-zinc-200 dark:text-zinc-800"}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-white/50 dark:bg-zinc-900/50 px-2 py-1 rounded-md border border-zinc-100 dark:border-zinc-800">
                                {selectedReview.retailer?.name || "Direct"}
                            </span>
                        </div>
                        <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                            &quot;{selectedReview.content}&quot;
                        </p>
                        <div className="mt-4 pt-4 border-t border-indigo-100/50 dark:border-indigo-900/30 flex items-center gap-4 text-xs text-zinc-500">
                             <span className="font-semibold text-indigo-600 dark:text-indigo-400">{selectedReview.product?.name}</span>
                             <span>•</span>
                             <span>{new Date(selectedReview.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>
                </div>

                {/* Editor Section */}
                <div className="space-y-5">
                   <div className="flex items-end justify-between">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Merchant Response</label>
                        <p className="text-sm text-zinc-500">Draft a personalized reply or use AI</p>
                     </div>
                     <button 
                        onClick={() => handleGenerateReply(selectedReview)}
                        disabled={isGenerating}
                        className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 dark:bg-indigo-900/20 dark:text-indigo-400 transition-all active:scale-95"
                     >
                        <div className={isGenerating ? "animate-spin" : ""}>
                            <Sparkles className="h-3.5 w-3.5" />
                        </div>
                        {isGenerating ? "Synthesizing..." : "Magic Draft"}
                     </button>
                   </div>
                   
                   <div className="group relative">
                        <textarea 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your response here..."
                            className="w-full h-56 rounded-2xl border border-zinc-200 bg-white p-6 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 resize-none transition-all placeholder:text-zinc-400"
                        />
                        <div className="absolute right-4 bottom-4 text-[10px] font-medium text-zinc-400 pointer-events-none">
                            {replyText.length} characters
                        </div>
                   </div>

                   <div className="rounded-xl border border-dashed border-zinc-200 p-4 dark:border-zinc-800">
                        <h5 className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Pro Tip</h5>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            Personalizing the first sentence with the customer&apos;s name and acknowledging their specific feedback increases retention by 14%.
                        </p>
                   </div>
                </div>
             </div>

             {/* Sticky Footer */}
             <div className="px-8 py-8 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/50 flex gap-4">
                <button 
                  onClick={() => setSelectedReview(null)}
                  className="px-6 py-3 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                >
                    Discard Draft
                </button>
                <button 
                   onClick={handleSaveResponse}
                   disabled={!replyText || isGenerating}
                   className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-bold text-white shadow-xl hover:bg-zinc-800 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-all active:translate-y-0.5"
                >
                    <Send className="h-4 w-4" />
                    Approve & Send
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
