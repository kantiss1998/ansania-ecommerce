'use client';

import { useAuthStore } from '@/store/authStore';
import { DashboardSidebar } from '@/components/features/dashboard/DashboardSidebar';

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
        <div className="container mx-auto px-4 py-8">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Akun Saya
                </h1>
                {user && (
                    <p className="mt-2 text-gray-600">
                        Selamat datang kembali, <span className="font-semibold">{user.full_name}</span>
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                {/* Sidebar */}
                <aside className="lg:col-span-1">
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                        <DashboardSidebar />
                    </div>
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-3">
                    {children}
                </main>
            </div>
        </div>
    );
}
