
"use client";

import React from "react";

interface ReportData {
  period: string;
  skuCount: number;
  totalReviews: number;
  metrics: {
    avgRating: { current: number; change: number };
    sentiment: { current: number; change: number }; // -1 to 1
    velocity: { current: number; change: number }; // percentage change
    responseRate: { current: number; change: number };
  };
  summary: string;
  topKeywords: Array<{ word: string; sentiment: "positive" | "negative"; score: number }>;
  aiInsights: {
    winner: { title: string; insight: string; recommendation: string };
    friction: { title: string; insight: string; recommendation: string };
    opportunity: { title: string; insight: string; recommendation: string };
  };
  retailerTable: Array<{ name: string; rating: number; insight: string }>;
  benchmarks: Array<{ metric: string; value: string; status: "higher" | "lower" }>;
  actionItems: Array<{ title: string; desc: string }>;
}

export default function ReviewPulseReport({ data }: { data: ReportData }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-4xl bg-white p-8 shadow-lg print:shadow-none dark:bg-zinc-900 dark:text-zinc-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div>
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">ReviewPulse</h1>
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest mt-1">
            Monthly Intelligence Report
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Prodomatix Demo</div>
          <div className="text-sm text-zinc-500">{data.period}</div>
        </div>
      </div>

      {/* Meta Bar */}
      <div className="mt-6 flex gap-8 rounded-lg bg-zinc-50 p-4 text-sm text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400">
        <div>
          <span className="font-semibold text-zinc-900 dark:text-zinc-200">Products Tracked:</span>{" "}
          {data.skuCount} SKUs
        </div>
        <div>
          <span className="font-semibold text-zinc-900 dark:text-zinc-200">Total Reviews Analyzed:</span>{" "}
          {data.totalReviews.toLocaleString()}
        </div>
        <div className="flex-1 text-right print:hidden">
          <button
            onClick={handlePrint}
            className="rounded bg-indigo-600 px-4 py-1 text-xs font-medium text-white hover:bg-indigo-700 cursor-pointer transition-all active:scale-95"
          >
            Download / Print PDF
          </button>
        </div>
      </div>

      {/* 1. Executive Summary */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-100">1. Executive Summary</h2>
        <div className="rounded-lg border-l-4 border-indigo-500 bg-indigo-50/50 p-4 text-zinc-800 dark:bg-indigo-900/10 dark:text-zinc-300">
          <p className="leading-relaxed">{data.summary}</p>
        </div>
      </section>

      {/* 2. Power Metrics */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">2. The &quot;Power Metrics&quot;</h2>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-200 text-sm font-medium text-zinc-500 dark:border-zinc-800">
              <th className="py-2">Metric</th>
              <th className="py-2">Current Month</th>
              <th className="py-2">Change (MoM)</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            <tr>
              <td className="py-3 font-medium">Global Avg. Rating</td>
              <td className="py-3 text-2xl font-bold">{data.metrics.avgRating.current.toFixed(1)} / 5.0</td>
              <td className={`py-3 font-medium ${data.metrics.avgRating.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {data.metrics.avgRating.change >= 0 ? '↑' : '↓'} {Math.abs(data.metrics.avgRating.change).toFixed(1)}
              </td>
              <td className="py-3 text-xs text-zinc-500">Target: 4.5</td>
            </tr>
            <tr>
              <td className="py-3 font-medium">Sentiment Score</td>
              <td className="py-3 text-2xl font-bold">
                {data.metrics.sentiment.current > 0 ? '+' : ''}{data.metrics.sentiment.current.toFixed(2)}
              </td>
              <td className={`py-3 font-medium ${data.metrics.sentiment.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {data.metrics.sentiment.change >= 0 ? '↑' : '↓'} {Math.abs(data.metrics.sentiment.change).toFixed(2)}
              </td>
              <td className="py-3 text-xs text-zinc-500">Positive Trend</td>
            </tr>
            <tr>
              <td className="py-3 font-medium">Review Velocity</td>
              <td className="py-3 text-2xl font-bold">{data.metrics.velocity.current} New</td>
              <td className={`py-3 font-medium ${data.metrics.velocity.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {data.metrics.velocity.change >= 0 ? '↑' : '↓'} {Math.abs(data.metrics.velocity.change)}%
              </td>
               <td className="py-3 text-xs text-zinc-500">Volume Check</td>
            </tr>
            <tr>
              <td className="py-3 font-medium">Response Rate</td>
              <td className="py-3 text-2xl font-bold">{data.metrics.responseRate.current}%</td>
              <td className={`py-3 font-medium ${data.metrics.responseRate.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {data.metrics.responseRate.change >= 0 ? '↑' : '↓'} {Math.abs(data.metrics.responseRate.change)}%
              </td>
              <td className="py-3 text-xs text-zinc-500">Critical Issues</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 3. Keyword Map */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">3. Keyword Map (Top Drivers)</h2>
        <div className="flex flex-wrap gap-2">
          {data.topKeywords.map((kw, i) => (
            <div
              key={i}
              className={`rounded px-3 py-1 text-sm font-medium ${
                kw.sentiment === "positive"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                  : "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200"
              }`}
            >
              {kw.word} <span className="opacity-60 text-xs">({kw.score})</span>
            </div>
          ))}
          {data.topKeywords.length === 0 && <span className="text-zinc-500 italic">No significant keywords trended this month.</span>}
        </div>
      </section>

      {/* 4. AI-Driven Product Insights */}
      <section className="mt-8 page-break-inside-avoid">
        <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">4. AI-Driven Product Insights</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {/* The Winner */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-900/10">
            <div className="mb-2 flex items-center font-bold text-emerald-700 dark:text-emerald-400">
              <span className="mr-2 text-xl">🏆</span> The Winner
            </div>
            <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">{data.aiInsights.winner.title}</h3>
            <p className="mb-2 text-xs text-zinc-600 dark:text-zinc-400">
              <strong>Insight:</strong> {data.aiInsights.winner.insight}
            </p>
            <div className="rounded bg-white p-2 text-xs text-zinc-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-300">
              <strong>Rec:</strong> {data.aiInsights.winner.recommendation}
            </div>
          </div>

          {/* The Friction */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/10">
            <div className="mb-2 flex items-center font-bold text-amber-700 dark:text-amber-400">
              <span className="mr-2 text-xl">⚠️</span> The Friction
            </div>
            <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">{data.aiInsights.friction.title}</h3>
            <p className="mb-2 text-xs text-zinc-600 dark:text-zinc-400">
              <strong>Insight:</strong> {data.aiInsights.friction.insight}
            </p>
            <div className="rounded bg-white p-2 text-xs text-zinc-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-300">
              <strong>Rec:</strong> {data.aiInsights.friction.recommendation}
            </div>
          </div>

          {/* The Opportunity */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/10">
            <div className="mb-2 flex items-center font-bold text-blue-700 dark:text-blue-400">
              <span className="mr-2 text-xl">💡</span> The Opportunity
            </div>
            <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">{data.aiInsights.opportunity.title}</h3>
            <p className="mb-2 text-xs text-zinc-600 dark:text-zinc-400">
              <strong>Insight:</strong> {data.aiInsights.opportunity.insight}
            </p>
            <div className="rounded bg-white p-2 text-xs text-zinc-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-300">
              <strong>Rec:</strong> {data.aiInsights.opportunity.recommendation}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Retailer Performance League Table */}
      <section className="mt-8 page-break-inside-avoid">
        <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">5. Retailer Performance League Table</h2>
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 font-medium text-zinc-500 dark:border-zinc-800">
              <th className="py-2">Partner</th>
              <th className="py-2">Rating</th>
              <th className="py-2">Insight</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {data.retailerTable.map((dealer, i) => (
              <tr key={i}>
                <td className="py-2 font-medium text-zinc-900 dark:text-zinc-100">{dealer.name}</td>
                <td className="py-2 font-bold text-zinc-900 dark:text-zinc-100">{dealer.rating} Stars</td>
                <td className="py-2 text-zinc-600 dark:text-zinc-400">{dealer.insight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 6. Competitive Benchmarking */}
      <section className="mt-8 page-break-inside-avoid">
        <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">6. Competitive Benchmarking</h2>
        <div className="space-y-3">
          {data.benchmarks.map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/30">
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.metric}</span>
              <span className={`text-sm font-semibold ${item.status === 'higher' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {item.value} {item.status === 'higher' ? 'Higher' : 'Lower'} than average
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Action Items */}
      <section className="mt-8 mb-8 page-break-inside-avoid">
        <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">7. Action Items for January</h2>
        <div className="space-y-2">
          {data.actionItems.map((action, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-1 h-4 w-4 rounded border border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-800" />
              <div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{action.title}:</span>{" "}
                <span className="text-zinc-600 dark:text-zinc-400">{action.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-zinc-200 pt-6 text-center text-xs text-zinc-400 dark:border-zinc-800">
        Generated automatically by Prodomatix Intelligence Engine • {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}
