
"use client";

import { useState } from "react";
import { generateReplyAction, saveResponseAction } from "@/app/actions";

interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  content: string;
  createdAt: string;
}

export default function ActionQueue({ reviews }: { reviews: Review[] }) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const handleGenerate = async (review: Review) => {
    setLoading(review.id);
    try {
      const response = await generateReplyAction(review.content, review.rating, review.reviewerName);
      if (response) {
        setDrafts((prev) => ({ ...prev, [review.id]: response }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const handleApprove = async (reviewId: string) => {
    const response = drafts[reviewId];
    if (!response) return;
    
    setLoading(reviewId);
    try {
      const result = await saveResponseAction(reviewId, response);
      if (result.success) {
        setDrafts((prev) => {
          const newDrafts = { ...prev };
          delete newDrafts[reviewId];
          return newDrafts;
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  if (reviews.length === 0) {
    return <div className="p-6 text-center text-zinc-500">No urgent items. Great job!</div>;
  }

  return (
    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
      {reviews.map((review) => (
        <div key={review.id} className="p-4 transition hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
          <div className="flex justify-between">
            <div className="font-semibold text-zinc-900 dark:text-zinc-100">
              {review.reviewerName} <span className="text-zinc-400 font-normal">via Amazon</span>
            </div>
            <div className="text-xs text-zinc-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          <div className="mt-1 flex text-amber-500 text-sm">
            {"★".repeat(review.rating)}
            <span className="text-zinc-200 dark:text-zinc-700">{"★".repeat(5 - review.rating)}</span>
          </div>

          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">&quot;{review.content}&quot;</p>

          {drafts[review.id] ? (
            <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-sm text-indigo-900 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-200">
              <p className="font-semibold text-xs uppercase tracking-wide text-indigo-500 mb-1">AI Draft:</p>
              {drafts[review.id]}
              <div className="mt-2 flex gap-2">
                <button 
                  onClick={() => handleApprove(review.id)}
                  disabled={loading === review.id}
                  className="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading === review.id ? "Sending..." : "Approve & Send"}
                </button>
                <button 
                  onClick={() => setDrafts(prev => { const n = {...prev}; delete n[review.id]; return n; })}
                  className="rounded px-3 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 cursor-pointer"
                >
                  Discard
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleGenerate(review)}
              disabled={loading === review.id}
              className="mt-3 flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50 dark:text-blue-400 cursor-pointer transition-all"
            >
              {loading === review.id ? (
                <>
                  <span className="animate-spin">⟳</span> Writing...
                </>
              ) : (
                <>
                  <span>⚡</span> Generate AI Response
                </>
              )}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
