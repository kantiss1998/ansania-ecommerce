"use client";

import { USER_ROLES } from "@repo/shared/constants";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  LogIn,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";

import { SearchBar } from "@/components/features/search/SearchBar";
import { Avatar } from "@/components/ui/Avatar";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";

/**
 * Header component with navigation, cart, and user menu
 */
export function Header() {
  const { user, isAuthenticated } = useAuthStore();
  const { getCartItemsCount } = useCartStore();
  const { openCartDrawer, toggleMobileMenu, isMobileMenuOpen } = useUiStore();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const cartCount = getCartItemsCount();

  // Prevent hydration mismatch by only rendering client-side content after mount
  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-gray-200/50 bg-white/95 backdrop-blur-xl shadow-sm"
          : "bg-white/80 backdrop-blur-md border-b border-transparent"
      }`}
    >
      {/* Top Banner (Optional) */}
      {!scrolled && (
        <div className="bg-gradient-primary text-white py-2 text-center text-sm animate-fade-in">
          <div className="container mx-auto px-4 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">
              Gratis Ongkir untuk pembelian di atas Rp 1.000.000
            </span>
          </div>
        </div>
      )}

      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group relative">
          <div className="absolute -inset-2 bg-gradient-primary rounded-lg opacity-0 group-hover:opacity-10 blur transition-opacity" />
          <span className="text-2xl font-bold font-heading bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent transition-all group-hover:scale-105 relative z-10">
            Ansania
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-1 md:flex">
          {[
            { name: "Products", href: "/products" },
            { name: "Categories", href: "/categories" },
            { name: "About", href: "/about" },
            { name: "Contact", href: "/contact-us" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors relative group rounded-lg hover:bg-primary-50/50"
            >
              {item.name}
              <span className="absolute inset-x-4 -bottom-0.5 h-0.5 bg-gradient-primary transform scale-x-0 origin-left transition-transform group-hover:scale-x-100 rounded-full" />
            </Link>
          ))}
          {mounted && user?.role === USER_ROLES.ADMIN && (
            <Link
              href="/admin/dashboard"
              className="text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
            >
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Search Bar (Desktop) */}
        <div className="mx-4 hidden flex-1 md:block max-w-sm lg:max-w-md">
          <Suspense
            fallback={
              <div className="h-10 w-full rounded-full bg-gray-100 animate-pulse" />
            }
          >
            <SearchBar />
          </Suspense>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Search Icon (Mobile) */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="rounded-full p-2.5 text-gray-600 hover:bg-primary-50 hover:text-primary-600 md:hidden transition-all active:scale-95"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Wishlist Icon */}
          {mounted && isAuthenticated && (
            <Link
              href="/user/wishlist"
              className="hidden md:flex rounded-full p-2.5 text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-all relative group"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5 group-hover:fill-primary-600 transition-all" />
            </Link>
          )}

          {/* Cart Icon with Badge */}
          <button
            onClick={openCartDrawer}
            className="relative rounded-full p-2.5 text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-all active:scale-95"
            aria-label="Shopping cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {mounted && cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-primary text-[10px] font-bold text-white ring-2 ring-white shadow-md"
              >
                {cartCount > 9 ? "9+" : cartCount}
              </motion.span>
            )}
          </button>

          {/* User Menu or Login */}
          {mounted && isAuthenticated && user ? (
            <div className="relative hidden md:block group">
              <Link
                href="/user"
                className="flex items-center space-x-2 rounded-full border border-gray-200 px-3 py-1.5 hover:bg-primary-50 hover:border-primary-200 transition-all"
              >
                <Avatar
                  fallback={user.full_name?.charAt(0).toUpperCase() || "U"}
                  size="sm"
                  status="online"
                />
                <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                  {user.full_name?.split(" ")[0] || "User"}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Link>
            </div>
          ) : mounted ? (
            <Link
              href="/auth/login"
              className="hidden items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all hover:-translate-y-0.5 md:flex active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          ) : null}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="rounded-full p-2.5 text-gray-600 hover:bg-primary-50 hover:text-primary-600 md:hidden transition-all active:scale-95"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-3">
              <Suspense
                fallback={
                  <div className="h-10 w-full rounded-full bg-gray-100 animate-pulse" />
                }
              >
                <SearchBar />
              </Suspense>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white/98 backdrop-blur-xl overflow-hidden shadow-lg"
          >
            <div className="space-y-1 px-4 py-4">
              {[
                { name: "Home", href: "/" },
                { name: "Products", href: "/products" },
                { name: "Categories", href: "/categories" },
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact-us" },
              ].map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={toggleMobileMenu}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100/50 hover:text-primary-700 transition-all"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              {mounted && !isAuthenticated && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link
                    href="/auth/login"
                    onClick={toggleMobileMenu}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 text-sm font-medium text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all active:scale-95"
                  >
                    <LogIn className="w-4 h-4" />
                    Login / Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
