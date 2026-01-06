
import { db } from "@/lib/db";
import { retailers } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Store, Globe } from "lucide-react";
import AddRetailerButton from "@/components/admin/AddRetailerButton";
import RetailerActions from "@/components/admin/RetailerActions";

export default async function AdminRetailersPage() {
  const allRetailers = await db.query.retailers.findMany({
    orderBy: [desc(retailers.createdAt)],
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Retailer Network</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Manage syndication partners and API credentials.</p>
        </div>
        <AddRetailerButton />
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 overflow-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50/50 text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:bg-zinc-800/50">
              <tr>
                <th className="px-8 py-4">Retailer</th>
                <th className="px-8 py-4">API Auth</th>
                <th className="px-8 py-4">Webhooks</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {allRetailers.map((retailer) => (
                <tr key={retailer.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20">
                        <Store className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">{retailer.name}</p>
                        {retailer.website && (
                          <span className="text-[10px] text-zinc-400">{retailer.website}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <code className="rounded-lg bg-zinc-100 px-2 py-1 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {retailer.apiKey ? `${retailer.apiKey.substring(0, 8)}...` : 'NO_KEY'}
                    </code>
                  </td>
                  <td className="px-8 py-6">
                    {retailer.webhookUrl ? (
                      <div className="flex items-center gap-2 max-w-[200px]">
                        <Globe className="h-3 w-3 text-zinc-400 shrink-0" />
                        <span className="text-xs text-zinc-500 truncate">{retailer.webhookUrl}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-400 italic">Not Configured</span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest">Active Sync</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <RetailerActions retailer={retailer} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allRetailers.length === 0 && (
          <div className="flex flex-col items-center justify-center p-20 text-zinc-400">
            <Store className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-sm font-medium">No retailers found. Start your syndication network!</p>
          </div>
        )}
      </div>
    </div>
  );
}
