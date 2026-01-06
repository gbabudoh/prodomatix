
"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";

interface ExportReview {
  id: string;
  reviewerName: string | null;
  rating: number;
  content: string;
  sentiment: string | null;
  product?: { name: string } | null;
  retailer?: { name: string | null } | null;
  createdAt: string;
  manufacturerResponse: string | null;
}

interface ExportButtonProps {
  data: ExportReview[];
  filename?: string;
}

export default function ExportButton({ data, filename = "reviewpulse-export.csv" }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    try {
      if (!data || data.length === 0) {
        alert("No data available to export.");
        return;
      }

      // 1. Define CSV Headers
      const headers = ["ID", "Reviewer", "Rating", "Content", "Sentiment", "Product", "Retailer", "Date", "Response"];
      
      // 2. Map Data to Rows
      const rows = data.map(r => [
        r.id,
        r.reviewerName || "Anonymous",
        r.rating,
        `"${r.content.replace(/"/g, '""')}"`,
        r.sentiment || "N/A",
        r.product?.name || "N/A",
        r.retailer?.name || "Direct Site",
        new Date(r.createdAt).toLocaleString(),
        r.manufacturerResponse ? `"${r.manufacturerResponse.replace(/"/g, '""')}"` : ""
      ]);

      // 3. Construct CSV String
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");

      // 4. Trigger Download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button 
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm ring-1 ring-zinc-900/5 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-800 dark:hover:bg-zinc-700 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
    >
      <Download className={`h-4 w-4 ${isExporting ? 'animate-bounce' : ''}`} />
      {isExporting ? "Preparing..." : "Export Data"}
    </button>
  );
}
