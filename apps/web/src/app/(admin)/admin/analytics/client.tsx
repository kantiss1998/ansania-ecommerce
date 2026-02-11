'use client';

import Link from 'next/link';
import { Suspense } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface AdminAnalyticsClientProps {
    initialData: {
        views: any | null;
        conversion: any | null;
        abandonedCarts: any | null;
    } | null;
}

function AdminAnalyticsContent({ initialData }: AdminAnalyticsClientProps) {
    if (!initialData) {
        return (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white">
                <p className="text-gray-500">Gagal memuat data analitik.</p>
            </div>
        );
    }

    const { views, conversion, abandonedCarts } = initialData;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Digital Analytics</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Pantau traffic pengunjung, tingkat konversi, dan efektivitas funnel belanja
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="md">
                        Real-time View
                    </Button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-6 md:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Views</h4>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{views?.total_views || '0'}</p>
                    <div className="mt-1 text-[10px] text-success-600 font-medium">↑ 5.2% dari minggu lalu</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Unique Visitors</h4>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{views?.unique_visitors || '0'}</p>
                    <div className="mt-1 text-[10px] text-gray-500 font-medium">Rerata 420 per hari</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Conversion Rate</h4>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{conversion?.rate ? `${conversion.rate}%` : '0%'}</p>
                    <div className="mt-1 text-[10px] text-error-600 font-medium">↓ 0.8% dari target</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Abandoned Cart</h4>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{abandonedCarts?.count || '0'}</p>
                    <div className="mt-1 text-[10px] text-warning-600 font-medium">{abandonedCarts?.total_value_formatted || 'Rp 0'} potensi hilang</div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Traffic Sources - Mock Visualization */}
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col lg:col-span-2">
                    <div className="border-b border-gray-100 px-6 py-4">
                        <h3 className="font-semibold text-gray-900">Traffic Over Time</h3>
                    </div>
                    <div className="p-8 flex-1 flex items-center justify-center">
                        {/* Placeholder for a line chart visualization */}
                        <div className="w-full h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200 relative overflow-hidden">
                            {/* Simple SVG Line Chart lookalike */}
                            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                                <path
                                    d="M0 200 Q 100 150, 200 180 T 400 100 T 600 120 T 800 50 L 800 256 L 0 256 Z"
                                    fill="url(#gradient)"
                                    fillOpacity="0.1"
                                />
                                <path
                                    d="M0 200 Q 100 150, 200 180 T 400 100 T 600 120 T 800 50"
                                    fill="none"
                                    stroke="#ec4899"
                                    strokeWidth="3"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#ec4899" />
                                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span className="relative z-10 text-xs text-gray-400 font-medium italic">Trend Pengunjung 30 Hari Terakhir</span>
                        </div>
                    </div>
                </div>

                {/* Top Keywords / Search */}
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm border-l-4 border-l-secondary-500">
                    <div className="border-b border-gray-100 px-6 py-4">
                        <h3 className="font-semibold text-gray-900">Paling Banyak Dicari</h3>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-4">
                            {[
                                { key: 'Pasmina Silk', count: 1240 },
                                { key: 'Gamis Syari', count: 890 },
                                { key: 'Scarf Motif', count: 750 },
                                { key: 'Inner Ninja', count: 520 },
                                { key: 'Bergo Kaos', count: 410 },
                            ].map((item, i) => (
                                <li key={i} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 font-medium">{item.key}</span>
                                    <Badge variant="default" className="text-[10px]">{item.count} hits</Badge>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8">
                            <Link href="/admin/analytics/search-history">
                                <Button variant="ghost" size="sm" className="w-full text-secondary-600 border border-secondary-100 hover:bg-secondary-50">
                                    Lihat Riwayat Search
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-4">
                <Link href="/admin/analytics/product-views" className="px-5 py-3 rounded-xl bg-white border border-gray-200 hover:shadow-sm transition-all text-sm font-medium text-gray-700">Views by Product</Link>
                <Link href="/admin/analytics/abandoned-carts" className="px-5 py-3 rounded-xl bg-white border border-gray-200 hover:shadow-sm transition-all text-sm font-medium text-gray-700">Checkout Drop-off Analysis</Link>
                <Link href="/admin/analytics/revenue-by-category" className="px-5 py-3 rounded-xl bg-white border border-gray-200 hover:shadow-sm transition-all text-sm font-medium text-gray-700">Category Profitability</Link>
            </div>
        </div>
    );
}

export default function AdminAnalyticsClient({ initialData }: AdminAnalyticsClientProps) {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Menganalisis traffic web...</div>}>
            <AdminAnalyticsContent initialData={initialData} />
        </Suspense>
    );
}
