
"use client";

import React from "react";
import { ChevronRight, ChevronDown, Copy } from "lucide-react";

interface ApiSectionProps {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  endpoint: string;
  description: string;
  bodyTitle?: string;
  bodyJson?: string;
  headers?: { key: string; value: string }[];
  queryParams?: { key: string; description: string }[];
  responseJson?: string;
}

export default function ApiSection({
  method,
  endpoint,
  description,
  bodyTitle,
  bodyJson,
  headers,
  queryParams,
  responseJson
}: ApiSectionProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  const methodColors = {
    GET: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-800",
    POST: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800",
    PATCH: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-800",
    DELETE: "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border-rose-100 dark:border-rose-800",
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <span className={`rounded-lg border px-3 py-1 text-xs font-bold ${methodColors[method]}`}>
            {method}
          </span>
          <code className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-50">{endpoint}</code>
          <p className="hidden text-sm text-zinc-500 dark:text-zinc-400 md:block">{description}</p>
        </div>
        {isOpen ? <ChevronDown className="h-4 w-4 text-zinc-400" /> : <ChevronRight className="h-4 w-4 text-zinc-400" />}
      </button>

      {isOpen && (
        <div className="border-t border-zinc-100 p-6 dark:border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column: Details */}
            <div className="space-y-6">
              {headers && headers.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Headers</h4>
                  <div className="space-y-1">
                    {headers.map((h, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-950">
                        <code className="text-xs font-mono text-indigo-600 dark:text-indigo-400">{h.key}</code>
                        <span className="text-xs text-zinc-500">{h.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {queryParams && queryParams.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Query Parameters</h4>
                  <div className="space-y-1">
                    {queryParams.map((q, i) => (
                      <div key={i} className="flex items-start justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-950">
                        <code className="text-xs font-mono text-emerald-600 dark:text-emerald-400">{q.key}</code>
                        <span className="text-xs text-zinc-500 leading-relaxed max-w-[200px] text-right">{q.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {bodyJson && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">{bodyTitle || "Request Body"}</h4>
                    <button className="text-zinc-400 hover:text-zinc-600">
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="rounded-xl bg-zinc-950 p-4 text-[13px] font-mono text-zinc-300 shadow-inner">
                    <pre className="whitespace-pre-wrap">{bodyJson}</pre>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Response */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Expected Response (200 OK)</h4>
                <div className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              </div>
              <div className="rounded-xl bg-zinc-950 p-4 text-[13px] font-mono text-zinc-100 shadow-inner min-h-[200px]">
                <pre>{responseJson || `{\n  "status": "success",\n  "message": "Approved"\n}`}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
