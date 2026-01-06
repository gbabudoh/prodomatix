
import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopNav from "@/components/admin/AdminTopNav";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  // If no session, just render children (for login page)
  if (!session?.user) {
    return <>{children}</>;
  }

  // If not admin, redirect to dashboard
  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  // Authenticated admin - show full layout
  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:block">
        <AdminSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopNav />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
