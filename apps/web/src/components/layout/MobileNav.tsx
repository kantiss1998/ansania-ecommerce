'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

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
                className="fixed inset-0 z-40 bg-black/50 md:hidden"
                onClick={toggleMobileMenu}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                className={cn(
                    'fixed right-0 top-0 z-50 h-full w-[280px] bg-white shadow-xl',
                    'transform transition-transform duration-300 ease-in-out md:hidden',
                    'animate-in slide-in-from-right'
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 p-4">
                    <span className="text-lg font-bold text-primary-700">Menu</span>
                    <button
                        onClick={toggleMobileMenu}
                        className="rounded-lg p-2 hover:bg-gray-100"
                        aria-label="Close menu"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* User Section */}
                {isAuthenticated && user ? (
                    <div className="border-b border-gray-200 p-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-700 text-lg font-medium text-white">
                                {user.full_name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                    {user.full_name || 'User'}
                                </p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="border-b border-gray-200 p-4">
                        <Link
                            href="/auth/login"
                            onClick={toggleMobileMenu}
                            className="block w-full rounded-lg bg-primary-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-primary-800"
                        >
                            Login
                        </Link>
                    </div>
                )}

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto p-4">
                    <ul className="space-y-2">
                        <li>
                            <Link
                                href="/products"
                                onClick={toggleMobileMenu}
                                className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                Products
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/categories"
                                onClick={toggleMobileMenu}
                                className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                Categories
                            </Link>
                        </li>
                        {isAuthenticated && (
                            <>
                                <li>
                                    <Link
                                        href="/wishlist"
                                        onClick={toggleMobileMenu}
                                        className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Wishlist
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/orders"
                                        onClick={toggleMobileMenu}
                                        className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Orders
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/profile"
                                        onClick={toggleMobileMenu}
                                        className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Profile
                                    </Link>
                                </li>
                            </>
                        )}
                        <li>
                            <Link
                                href="/about"
                                onClick={toggleMobileMenu}
                                className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/contact"
                                onClick={toggleMobileMenu}
                                className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                Contact
                            </Link>
                        </li>
                    </ul>

                    {isAuthenticated && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <button
                                onClick={handleLogout}
                                className="w-full rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </nav>
            </div>
        </>
    );
}
