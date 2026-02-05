'use client';

import { useAuthStore } from '@/store/authStore';
import { AdminSidebar } from '@/components/features/admin/AdminSidebar';

/**
 * Admin layout with sidebar
 */
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuthStore();

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Admin Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Admin Portal
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Selamat datang, <span className="font-semibold">{user?.full_name}</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                {/* Sidebar */}
                <aside className="lg:col-span-1">
                    <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-4">
                        <AdminSidebar />
                    </div>
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-4">
                    {children}
                </main>
            </div>
        </div>
    );
}
