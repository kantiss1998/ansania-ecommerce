'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { AdminSidebar } from '@/components/features/admin/AdminSidebar';
import { useAuthStore } from '@/store/authStore';

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
        if (isAuthenticated && user && user.role !== 'admin') {
            router.push('/');
        }
    }, [user, isAuthenticated, router]);

    if (!isAuthenticated || user?.role !== 'admin') {
        return null; // Or a loading spinner
    }

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
                <button
                    onClick={async () => {
                        await useAuthStore.getState().logout();
                        window.location.href = '/auth/login';
                    }}
                    className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Keluar
                </button>
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
