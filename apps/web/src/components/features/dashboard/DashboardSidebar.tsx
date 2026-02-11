'use client';

import { LayoutDashboard, ShoppingBag, Heart, MapPin, User, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

/**
 * Dashboard sidebar navigation
 */
export function DashboardSidebar() {
    const pathname = usePathname();
    const { logout } = useAuthStore();

    const handleLogout = async () => {
        try {
            await logout();
            // Redirect to home and refresh to clear all states
            window.location.href = '/auth/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const menuItems = [
        {
            title: 'Dashboard',
            icon: LayoutDashboard,
            href: '/user',
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            title: 'Pesanan Saya',
            icon: ShoppingBag,
            href: '/user/orders',
            gradient: 'from-purple-500 to-pink-500',
        },
        {
            title: 'Wishlist',
            icon: Heart,
            href: '/user/wishlist',
            gradient: 'from-red-500 to-pink-500',
        },
        {
            title: 'Alamat Tersimpan',
            icon: MapPin,
            href: '/user/addresses',
            gradient: 'from-green-500 to-emerald-500',
        },
        {
            title: 'Profil Saya',
            icon: User,
            href: '/user/profile',
            gradient: 'from-amber-500 to-orange-500',
        },
        {
            title: 'Pengaturan Akun',
            icon: Settings,
            href: '/user/settings',
            gradient: 'from-gray-500 to-slate-600',
        },
    ];

    return (
        <nav className="space-y-2 w-full">
            {menuItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 overflow-hidden",
                            isActive
                                ? "text-white shadow-lg"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        {/* Gradient background for active state */}
                        {isActive && (
                            <>
                                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient}`} />
                                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} blur-xl opacity-30`} />
                            </>
                        )}

                        {/* Content */}
                        <Icon className={cn(
                            "relative h-5 w-5 transition-transform duration-200",
                            isActive ? "text-white" : "text-gray-400 group-hover:text-primary-600",
                            isActive && "scale-110"
                        )} />
                        <span className="relative">{item.title}</span>

                        {/* Active indicator */}
                        {isActive && (
                            <div className="relative ml-auto h-2 w-2 rounded-full bg-white shadow-sm" />
                        )}
                    </Link>
                );
            })}

            <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="group w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-error-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-error-700 transition-all duration-200"
                >
                    <LogOut className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    <span>Keluar</span>
                </button>
            </div>
        </nav>
    );
}
