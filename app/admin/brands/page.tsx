
import { db } from "@/lib/db";
import { brands } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Building2, ExternalLink, CreditCard } from "lucide-react";
import Image from "next/image";
import InviteBrandButton from "@/components/admin/InviteBrandButton";
import BrandActions from "@/components/admin/BrandActions";

export default async function AdminBrandsPage() {
  const allBrands = await db.query.brands.findMany({
    orderBy: [desc(brands.createdAt)],
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Brand Management</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Oversee all registered brands on the platform.</p>
        </div>
        <InviteBrandButton />
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 overflow-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50/50 text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:bg-zinc-800/50">
              <tr>
                <th className="px-8 py-4">Brand Details</th>
                <th className="px-8 py-4">Tier</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Joined</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {allBrands.map((brand) => (
                <tr key={brand.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                        {brand.logoUrl ? (
                          <Image 
                            src={brand.logoUrl} 
                            alt={brand.name} 
                            fill
                            className="object-cover" 
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-zinc-300">
                            <Building2 className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">{brand.name}</p>
                        {brand.website && (
                          <a href={brand.website} target="_blank" className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-indigo-600 cursor-pointer">
                            <ExternalLink className="h-2 w-2" />
                            {new URL(brand.website).hostname}
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
                      brand.subscriptionTier === 'enterprise' 
                      ? 'bg-purple-100 text-purple-700' 
                      : brand.subscriptionTier === 'pro' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'bg-zinc-100 text-zinc-600'
                    }`}>
                      <CreditCard className="h-3 w-3" />
                      {brand.subscriptionTier}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
                      brand.subscriptionStatus === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${brand.subscriptionStatus === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {brand.subscriptionStatus}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-zinc-500 text-xs font-medium">
                    {brand.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <BrandActions brand={brand} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allBrands.length === 0 && (
          <div className="flex flex-col items-center justify-center p-20 text-zinc-400">
            <Building2 className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-sm font-medium">No brands found. Ready to onboard your first partner?</p>
          </div>
        )}
      </div>
    </div>
  );
}
