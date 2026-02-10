'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, MessageCircle, Send, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

/**
 * Footer component with links and information
 */
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-br from-gray-50 via-white to-gray-50/50 pt-16 mt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Newsletter Section */}
                <div className="mb-16 rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 px-6 py-12 text-center text-white shadow-2xl shadow-primary-900/20 md:px-12 lg:text-left relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />

                    <div className="grid gap-8 lg:grid-cols-2 lg:items-center relative z-10">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                                <Mail className="h-4 w-4" />
                                <span className="text-sm font-medium">Newsletter</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 leading-tight">
                                Bergabung dengan Komunitas Kami
                            </h2>
                            <p className="text-primary-100 text-lg leading-relaxed">
                                Dapatkan penawaran eksklusif, inspirasi desain, dan pembaruan produk terbaru langsung ke inbox Anda.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                            <div className="flex-1 sm:max-w-xs">
                                <Input
                                    type="email"
                                    placeholder="Masukkan email Anda"
                                    className="w-full rounded-full border-none bg-white/10 px-6 py-3 text-white placeholder-primary-200 backdrop-blur-sm focus:ring-2 focus:ring-white"
                                    leftIcon={Mail}
                                />
                            </div>
                            <Button
                                variant="secondary"
                                size="lg"
                                className="rounded-full px-8 bg-white text-primary-900 font-bold hover:bg-primary-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                rightIcon={Send}
                            >
                                Berlangganan
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8 border-b border-gray-200 pb-12">
                    {/* Company Info */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block group">
                            <span className="text-3xl font-bold font-heading bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent group-hover:from-primary-700 group-hover:to-primary-900 transition-all">
                                Ansania
                            </span>
                        </Link>
                        <p className="text-gray-600 leading-relaxed">
                            Destinasi furnitur premium untuk hunian impian Anda. Kualitas terbaik dengan desain yang tak lekang oleh waktu.
                        </p>
                        <div className="flex space-x-3">
                            <a
                                href="#"
                                className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-1 transition-all"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transition-all"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-1 transition-all"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="font-heading font-bold text-gray-900 text-lg mb-6 relative inline-block">
                            Belanja
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-primary rounded-full" />
                        </h3>
                        <ul className="space-y-4 text-gray-600">
                            {[
                                { name: 'Semua Produk', href: '/products' },
                                { name: 'Kategori', href: '/categories' },
                                { name: 'Produk Pilihan', href: '/products?filter=featured' },
                                { name: 'Flash Sale', href: '/flash-sales' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-primary-600 hover:translate-x-1 transition-all inline-flex items-center gap-2 group"
                                    >
                                        <ArrowRight className="h-4 w-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="font-heading font-bold text-gray-900 text-lg mb-6 relative inline-block">
                            Bantuan
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-primary rounded-full" />
                        </h3>
                        <ul className="space-y-4 text-gray-600">
                            {[
                                { name: 'Hubungi Kami', href: '/contact-us' },
                                { name: 'FAQ', href: '/faq' },
                                { name: 'Informasi Pengiriman', href: '/shipping-info' },
                                { name: 'Pengembalian', href: '/returns-and-exchanges' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-primary-600 hover:translate-x-1 transition-all inline-flex items-center gap-2 group"
                                    >
                                        <ArrowRight className="h-4 w-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account Links & Contact */}
                    <div>
                        <h3 className="font-heading font-bold text-gray-900 text-lg mb-6 relative inline-block">
                            Kontak
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-primary rounded-full" />
                        </h3>
                        <ul className="space-y-4 text-gray-600">
                            <li className="flex items-start gap-3 group">
                                <div className="p-2 rounded-lg bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors">
                                    <MapPin className="h-4 w-4" />
                                </div>
                                <span className="flex-1">Jakarta, Indonesia</span>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <div className="p-2 rounded-lg bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <span>+62 812 3456 7890</span>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <div className="p-2 rounded-lg bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <span>support@ansania.com</span>
                            </li>
                            <li className="pt-4">
                                <Link href="/contact-us">
                                    <Button
                                        variant="gradient"
                                        size="sm"
                                        className="w-full rounded-full shadow-md hover:shadow-lg"
                                        leftIcon={MessageCircle}
                                    >
                                        Chat WhatsApp
                                    </Button>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="py-8">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-sm text-gray-500">
                            © {currentYear} Ansania. All rights reserved. Made with ❤️ in Indonesia
                        </p>

                        <div className="flex items-center space-x-6">
                            <Link
                                href="/privacy-policy"
                                className="text-sm text-gray-500 hover:text-primary-600 transition-colors relative group"
                            >
                                Kebijakan Privasi
                                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary-600 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100" />
                            </Link>
                            <Link
                                href="/terms-and-conditions"
                                className="text-sm text-gray-500 hover:text-primary-600 transition-colors relative group"
                            >
                                Syarat & Ketentuan
                                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary-600 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
