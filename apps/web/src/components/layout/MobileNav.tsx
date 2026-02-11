'use client';

import {
    X, Home, ShoppingBag, Grid, Heart,
    ClipboardList, User, Info, Phone, LogOut, LogIn
} from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';

/**
 * Mobile navigation drawer
 */
export function MobileNav() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const { isMobileMenuOpen, toggleMobileMenu } = useUiStore();

    // Lock body scroll when drawer is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const handleLogout = async () => {
        await logout();
        toggleMobileMenu();
        window.location.href = '/auth/login';
    };

    if (!isMobileMenuOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
                onClick={toggleMobileMenu}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                className={cn(
                    'fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white shadow-2xl flex flex-col',
                    'transform transition-transform duration-300 ease-in-out md:hidden',
                    'animate-in slide-in-from-right'
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 p-5">
                    <span className="text-xl font-bold font-heading text-primary-700">Menu</span>
                    <button
                        onClick={toggleMobileMenu}
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* User Section */}
                {isAuthenticated && user ? (
                    <div className="border-b border-gray-100 p-5 bg-gray-50/50">
                        <div className="flex items-center space-x-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700 ring-2 ring-white shadow-sm">
                                {user.full_name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 truncate">
                                    {user.full_name || 'User'}
                                </p>
                                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="border-b border-gray-100 p-5 bg-gray-50/50">
                        <Link
                            href="/auth/login"
                            onClick={toggleMobileMenu}
                            className="w-full"
                        >
                            <Button fullWidth variant="primary" className="justify-center shadow-lg shadow-primary-600/20">
                                <LogIn className="mr-2 h-4 w-4" />
                                Masuk / Daftar
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-200">
                    <div className="space-y-1">
                        <NavItem href="/" icon={Home} label="Beranda" onClick={toggleMobileMenu} />
                        <NavItem href="/products" icon={ShoppingBag} label="Produk" onClick={toggleMobileMenu} />
                        <NavItem href="/categories" icon={Grid} label="Kategori" onClick={toggleMobileMenu} />

                        {isAuthenticated && (
                            <>
                                <div className="my-4 border-t border-gray-100 pt-4">
                                    <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Akun Saya</p>
                                    <NavItem href="/user/wishlist" icon={Heart} label="Wishlist" onClick={toggleMobileMenu} />
                                    <NavItem href="/user/orders" icon={ClipboardList} label="Pesanan Saya" onClick={toggleMobileMenu} />
                                    <NavItem href="/user/profile" icon={User} label="Profil" onClick={toggleMobileMenu} />
                                </div>
                            </>
                        )}

                        <div className="my-4 border-t border-gray-100 pt-4">
                            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Bantuan</p>
                            <NavItem href="/about" icon={Info} label="Tentang Kami" onClick={toggleMobileMenu} />
                            <NavItem href="/contact-us" icon={Phone} label="Hubungi Kami" onClick={toggleMobileMenu} />
                        </div>
                    </div>
                </nav>

                {/* Logout Button */}
                {isAuthenticated && (
                    <div className="border-t border-gray-100 p-5 bg-gray-50/30">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:border-red-100 hover:text-red-700 active:scale-[0.98]"
                        >
                            <LogOut className="h-4 w-4" />
                            Keluar
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

function NavItem({
    href,
    icon: Icon,
    label,
    onClick
}: {
    href: string;
    icon: React.ElementType;
    label: string;
    onClick: () => void;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="group flex items-center gap-3 rounded-xl px-3 py-3 text-gray-600 transition-all hover:bg-primary-50 hover:text-primary-700 active:bg-primary-100"
        >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors group-hover:bg-white group-hover:text-primary-600 shadow-sm">
                <Icon className="h-4 w-4" />
            </div>
            <span className="font-medium">{label}</span>
        </Link>
    );
}
