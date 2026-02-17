"use client";

import { LogOut, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AdminSidebar } from "@/components/features/admin/AdminSidebar";
import { useAuthStore } from "@/store/authStore";

/**
 * Admin layout with sidebar
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user && user.role !== "admin") {
      router.push("/");
    }
  }, [user, isAuthenticated, router]);

  if (!isAuthenticated || user?.role !== "admin") {
    return null; // Or a loading spinner
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-100/30 to-purple-100/30 rounded-full blur-3xl opacity-50 -z-10 animate-pulse-slow" />
      <div
        className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-100/30 to-cyan-100/30 rounded-full blur-3xl opacity-50 -z-10 animate-pulse-slow"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Admin Header */}
        <div className="mb-8 rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-sm p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 px-5 py-2.5 shadow-sm border border-indigo-100/50 mb-4">
                <Shield className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-700">
                  Admin Portal
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 bg-clip-text text-transparent font-heading">
                Dashboard Admin
              </h1>
              <p className="mt-3 text-base text-gray-600">
                Selamat datang,{" "}
                <span className="font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  {user?.full_name}
                </span>
              </p>
            </div>
            <button
              onClick={async () => {
                await useAuthStore.getState().logout();
                window.location.href = "/auth/login";
              }}
              className="flex items-center gap-2 rounded-2xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50 px-5 py-3 text-sm font-semibold text-red-600 transition-all hover:from-red-600 hover:to-orange-600 hover:text-white hover:border-red-600 shadow-md hover:shadow-lg"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-gray-200 bg-white/90 backdrop-blur-sm p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <AdminSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
