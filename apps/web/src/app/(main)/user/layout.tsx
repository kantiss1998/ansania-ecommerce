"use client";

import { Sparkles, User } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/10 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-pulse-slow" />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Enhanced Welcome Header */}
        <div className="mb-12 text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-purple-50 rounded-full px-5 py-2.5 shadow-sm border border-primary-100/50">
            <User className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">
              Dashboard Akun
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent font-heading">
            Akun Saya
          </h1>

          {user && (
            <p className="mt-3 text-lg text-gray-600">
              Selamat datang kembali,{" "}
              <span className="font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                {user.full_name}
              </span>
            </p>
          )}

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary-300" />
            <Sparkles className="h-4 w-4 text-primary-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 max-w-7xl mx-auto">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-gray-200 bg-white p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slide-up">
              <DashboardSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <main
            className="lg:col-span-3 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
