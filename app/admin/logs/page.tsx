
import { db } from "@/lib/db";
import { adminLogs } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { 
  Shield, 
  Activity,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";

export default async function AuditLogsPage() {
  // Fetch recent audit logs
  const logs = await db.select().from(adminLogs).orderBy(desc(adminLogs.createdAt)).limit(100);

  const stats = {
    total: logs.length,
    today: logs.filter(l => {
      const logDate = new Date(l.createdAt);
      const today = new Date();
      return logDate.toDateString() === today.toDateString();
    }).length,
    thisWeek: logs.filter(l => {
      const logDate = new Date(l.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return logDate >= weekAgo;
    }).length,
  };

  const kpis = [
    { name: "Total Logs", value: stats.total, icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Today's Activity", value: stats.today, icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
    { name: "This Week", value: stats.thisWeek, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { name: "Unique Admins", value: new Set(logs.map(l => l.adminId)).size, icon: Shield, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  const getActionIcon = (action: string) => {
    if (action.toLowerCase().includes("create")) return CheckCircle2;
    if (action.toLowerCase().includes("delete")) return XCircle;
    if (action.toLowerCase().includes("update")) return Activity;
    return Shield;
  };

  const getActionColor = (action: string) => {
    if (action.toLowerCase().includes("create")) return { bg: "bg-emerald-100 dark:bg-emerald-900/20", text: "text-emerald-600" };
    if (action.toLowerCase().includes("delete")) return { bg: "bg-red-100 dark:bg-red-900/20", text: "text-red-600" };
    if (action.toLowerCase().includes("update")) return { bg: "bg-blue-100 dark:bg-blue-900/20", text: "text-blue-600" };
    return { bg: "bg-indigo-100 dark:bg-indigo-900/20", text: "text-indigo-600" };
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Audit Logs</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Monitor all administrative actions and system events.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.name} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-4">
                <div className={`rounded-xl ${kpi.bg} p-2 ${kpi.color}`}>
                    <kpi.icon className="h-6 w-6" />
                </div>
            </div>
            <p className="text-sm font-bold text-zinc-500">{kpi.name}</p>
            <h2 className="text-3xl font-black mt-1">{kpi.value}</h2>
          </div>
        ))}
      </div>

      {/* Logs Table */}
      <div className="rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 overflow-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
        <div className="border-b border-zinc-100 bg-zinc-50/50 px-8 py-6 dark:border-zinc-800 dark:bg-zinc-800/50">
          <h2 className="text-lg font-bold">Recent Activity</h2>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {logs.length === 0 ? (
            <div className="p-12 text-center">
              <Shield className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
              <p className="text-sm font-bold text-zinc-500">No audit logs yet</p>
              <p className="text-xs text-zinc-400 mt-1">Administrative actions will appear here</p>
            </div>
          ) : (
            logs.map((log) => {
              const ActionIcon = getActionIcon(log.action);
              const colors = getActionColor(log.action);
              return (
                <div key={log.id} className="p-6 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${colors.bg}`}>
                        <ActionIcon className={`h-5 w-5 ${colors.text}`} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{log.action}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-zinc-500">
                            Admin: {log.adminId.slice(0, 8)}...
                          </span>
                          <span className="text-xs text-zinc-400">•</span>
                          <span className="text-xs text-zinc-500">
                            {log.targetType}: {log.targetId.slice(0, 8)}...
                          </span>
                        </div>
                        {log.details && (
                          <p className="text-xs text-zinc-400 mt-2 font-mono bg-zinc-50 dark:bg-zinc-900 rounded px-2 py-1 inline-block">{log.details}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
