
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import Sidebar from "@/components/dashboard/Sidebar";
import TopNav from "@/components/dashboard/TopNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user && process.env.NODE_ENV !== "development") {
      redirect("/");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Sidebar />
      <div className="pl-72 transition-all duration-300">
        <TopNav />
        <main className="p-8">
            <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
}
