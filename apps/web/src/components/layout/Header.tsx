'use client';

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useUiStore } from '@/store/uiStore';
import { SearchBar } from '@/components/features/search/SearchBar';

/**
 * Header component with navigation, cart, and user menu
 */
export function Header() {
    const { user, isAuthenticated } = useAuthStore();
    const { getCartItemsCount } = useCartStore();
    const { openCartDrawer, toggleMobileMenu } = useUiStore();
    const [mounted, setMounted] = useState(false);

    const cartCount = getCartItemsCount();

    // Prevent hydration mismatch by only rendering client-side content after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
            <div className="container mx-auto flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-primary-700">
                        Ansania
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center space-x-6 md:flex">
                    <Link
                        href="/products"
                        className="text-sm font-medium text-gray-700 hover:text-primary-700"
                    >
                        Products
                    </Link>
                    <Link
                        href="/categories"
                        className="text-sm font-medium text-gray-700 hover:text-primary-700"
                    >
                        Categories
                    </Link>
                    <Link
                        href="/about"
                        className="text-sm font-medium text-gray-700 hover:text-primary-700"
                    >
                        About
                    </Link>
                    <Link
                        href="/contact"
                        className="text-sm font-medium text-gray-700 hover:text-primary-700"
                    >
                        Contact
                    </Link>
                </nav>

                {/* Search Bar (Desktop) */}
                <div className="mx-4 hidden flex-1 md:block max-w-md">
                    <Suspense fallback={<div className="h-10 w-full rounded-lg bg-gray-100" />}>
                        <SearchBar />
                    </Suspense>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center space-x-4">
                    {/* Search Icon (Mobile) */}
                    <button
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
                        aria-label="Search"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </button>

                    {/* Wishlist Icon */}
                    {mounted && isAuthenticated && (
                        <Link
                            href="/wishlist"
                            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                            aria-label="Wishlist"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </Link>
                    )}

                    {/* Cart Icon with Badge */}
                    <button
                        onClick={openCartDrawer}
                        className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                        aria-label="Shopping cart"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                        {mounted && cartCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-700 text-xs font-medium text-white">
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </button>

                    {/* User Menu or Login */}
                    {mounted && isAuthenticated && user ? (
                        <div className="relative hidden md:block">
                            <Link
                                href="/profile"
                                className="flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-gray-100"
                            >
                                <div className="h-8 w-8 rounded-full bg-primary-700 text-white flex items-center justify-center text-sm font-medium">
                                    {user.full_name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                    {user.full_name || user.email}
                                </span>
                            </Link>
                        </div>
                    ) : mounted ? (
                        <Link
                            href="/auth/login"
                            className="hidden rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 md:block"
                        >
                            Login
                        </Link>
                    ) : null}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
                        aria-label="Menu"
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
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}
