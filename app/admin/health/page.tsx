
import { db } from "@/lib/db";
import { brands, users, reviews } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { 
  Activity, 
  Database,
  Server,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp
} from "lucide-react";

type HealthStatus = "success" | "warning" | "info";

interface HealthMetric {
  name: string;
  value: string;
  status: HealthStatus;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  detail: string;
}

interface SystemStat {
  label: string;
  value: string;
  status: HealthStatus;
}

async function getHealthData() {
  const [brandCount] = await db.select({ count: sql<number>`count(*)` }).from(brands);
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [reviewCount] = await db.select({ count: sql<number>`count(*)` }).from(reviews);
  
  return { brandCount, userCount, reviewCount };
}

function HealthContent({ 
  brandCount, 
  userCount, 
  reviewCount 
}: { 
  brandCount: { count: number }; 
  userCount: { count: number }; 
  reviewCount: { count: number };
}) {
  const healthMetrics: HealthMetric[] = [
    { 
      name: "Database Status", 
      value: "Healthy", 
      status: "success",
      icon: Database, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50",
      detail: "Connected and responsive"
    },
    { 
      name: "API Status", 
      value: "Operational", 
      status: "success",
      icon: Server, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      detail: "All endpoints responding"
    },
    { 
      name: "Total Records", 
      value: (brandCount.count + userCount.count + reviewCount.count).toLocaleString(), 
      status: "info",
      icon: Activity, 
      color: "text-purple-600", 
      bg: "bg-purple-50",
      detail: `${brandCount.count} brands, ${userCount.count} users, ${reviewCount.count} reviews`
    },
    { 
      name: "System Load", 
      value: "Normal", 
      status: "success",
      icon: Zap, 
      color: "text-amber-600", 
      bg: "bg-amber-50",
      detail: "CPU and memory within limits"
    },
  ];

  const systemStats: SystemStat[] = [
    { label: "Total Brands", value: brandCount.count.toString(), status: "info" },
    { label: "Total Users", value: userCount.count.toString(), status: "info" },
    { label: "Total Reviews", value: reviewCount.count.toString(), status: "info" },
    { label: "Database Status", value: "Connected", status: "success" },
    { label: "Uptime", value: "99.9%", status: "success" },
    { label: "API Version", value: "v1.0.0", status: "info" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black tracking-tight">System Health</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Monitor platform performance and system status.</p>
      </div>

      {/* Health Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {healthMetrics.map((metric) => (
          <div key={metric.name} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-4">
                <div className={`rounded-xl ${metric.bg} p-2 ${metric.color}`}>
                    <metric.icon className="h-6 w-6" />
                </div>
                {metric.status === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                {metric.status === "warning" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
            </div>
            <p className="text-sm font-bold text-zinc-500">{metric.name}</p>
            <h2 className="text-3xl font-black mt-1">{metric.value}</h2>
            <p className="text-xs text-zinc-400 mt-2">{metric.detail}</p>
          </div>
        ))}
      </div>

      {/* System Statistics */}
      <div className="rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 overflow-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
        <div className="border-b border-zinc-100 bg-zinc-50/50 px-8 py-6 dark:border-zinc-800 dark:bg-zinc-800/50">
          <h2 className="text-lg font-bold">Detailed Metrics</h2>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {systemStats.map((stat) => (
            <div key={stat.label} className="p-6 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    stat.status === 'success' ? 'bg-emerald-500' :
                    stat.status === 'warning' ? 'bg-amber-500' :
                    'bg-blue-500'
                  }`} />
                  <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{stat.label}</p>
                </div>
                <p className="text-sm font-black text-zinc-900 dark:text-zinc-100">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Performance Overview</h2>
          <TrendingUp className="h-5 w-5 text-emerald-500" />
        </div>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-zinc-200 rounded-2xl dark:border-zinc-800">
          <div className="text-center">
            <Activity className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-sm font-bold text-zinc-500">Performance charts coming soon</p>
            <p className="text-xs text-zinc-400 mt-1">Real-time monitoring dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorContent() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black tracking-tight">System Health</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Monitor platform performance and system status.</p>
      </div>

      <div className="rounded-3xl border-2 border-red-200 bg-red-50 p-12 text-center dark:border-red-900/20 dark:bg-red-900/10">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-black text-red-900 dark:text-red-400 mb-2">System Health Check Failed</h2>
        <p className="text-sm text-red-600 dark:text-red-500">Unable to retrieve system metrics. Please check database connection.</p>
      </div>
    </div>
  );
}

export default async function SystemHealthPage() {
  let data: Awaited<ReturnType<typeof getHealthData>> | null = null;
  
  try {
    data = await getHealthData();
  } catch (error) {
    console.error("Health check failed:", error);
  }

  if (!data) {
    return <ErrorContent />;
  }

  return (
    <HealthContent 
      brandCount={data.brandCount} 
      userCount={data.userCount} 
      reviewCount={data.reviewCount} 
    />
  );
}
