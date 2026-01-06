
import { db } from "@/lib/db";
import { Shield, User as UserIcon, Mail, Calendar, Building2, Store } from "lucide-react";
import { desc } from "drizzle-orm";
import { users, brands, retailers } from "@/lib/db/schema";
import Image from "next/image";
import UserActions from "@/components/admin/UserActions";

export default async function AdminUsersPage() {
  const allUsers = await db.query.users.findMany({
    with: {
      brand: true,
      retailer: true,
    },
    orderBy: [desc(users.createdAt)],
  });

  // Get all brands and retailers for the dropdown
  const allBrands = await db.query.brands.findMany();
  const allRetailers = await db.query.retailers.findMany();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Access Control</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Manage user roles and platform permissions.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 overflow-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50/50 text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:bg-zinc-800/50">
              <tr>
                <th className="px-8 py-4">User Details</th>
                <th className="px-8 py-4">Role</th>
                <th className="px-8 py-4">Associated Entity</th>
                <th className="px-8 py-4">Joined</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {allUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative h-10 w-10 overflow-hidden rounded-xl border-2 border-zinc-100 bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || "User Avatar"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-zinc-400">
                            <UserIcon className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">{user.name || "Anonymous User"}</p>
                        <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                          <Mail className="h-2 w-2" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
                      user.role === 'admin' 
                      ? 'bg-red-100 text-red-700' 
                      : user.role === 'brand_user' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      <Shield className="h-3 w-3" />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    {user.brand ? (
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                            <Building2 className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">{(user.brand as { name: string }).name}</span>
                        </div>
                    ) : user.retailer ? (
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                            <Store className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">{(user.retailer as { name: string }).name}</span>
                        </div>
                    ) : (
                        <span className="text-xs text-zinc-400 italic">No Association</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-zinc-500 text-xs font-medium">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {user.createdAt.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <UserActions 
                      user={user}
                      brands={allBrands.map(b => ({ id: b.id, name: b.name }))}
                      retailers={allRetailers.map(r => ({ id: r.id, name: r.name }))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center p-20 text-zinc-400">
            <UserIcon className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-sm font-medium">No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
