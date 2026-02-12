"use client";

import { Sparkles } from "lucide-react";

import { DashboardSidebar } from "@/components/features/dashboard/DashboardSidebar";
import { useAuthStore } from "@/store/authStore";

/**
 * User dashboard layout with sidebar
 */
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Welcome Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-purple-50 rounded-full px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">
              Dashboard Akun
            </span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent font-heading">
            Akun Saya
          </h1>
          {user && (
            <p className="mt-2 text-gray-600">
              Selamat datang kembali,{" "}
              <span className="font-semibold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                {user.full_name}
              </span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <DashboardSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
