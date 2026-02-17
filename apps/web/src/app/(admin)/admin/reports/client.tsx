"use client";

import {
  SalesReportData,
  CustomerReportData,
  InventoryReportData,
} from "@repo/shared";
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  Download,
  Loader2,
  FileX,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

interface AdminReportsClientProps {
  initialData: {
    sales: SalesReportData | null;
    customers: CustomerReportData | null;
    inventory: InventoryReportData | null;
  } | null;
}

function AdminReportsContent({ initialData }: AdminReportsClientProps) {
  if (!initialData) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-white">
        <div className="text-center">
          <FileX className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-base font-medium text-gray-600">
            Gagal memuat data laporan.
          </p>
        </div>
      </div>
    );
  }

  const { sales, customers, inventory } = initialData;

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-2.5 shadow-sm border border-emerald-100/50 mb-4">
              <BarChart3 className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">
                Business Analytics
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-gray-900 bg-clip-text text-transparent font-heading">
              Reports & Analytics
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Analisis performa bisnis, perilaku pelanggan, dan status inventori
            </p>
          </div>
          <Button variant="outline" size="md" className="rounded-2xl">
            <Download className="mr-2 h-4 w-4" />
            Download PDF Summary
          </Button>
        </div>
      </div>

      {/* Top Summaries */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-gradient-to-br from-white to-blue-50 p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-blue-200 opacity-30" />
          <div className="inline-flex p-3 rounded-2xl bg-blue-100 border border-blue-200 mb-3">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-600">
            Total Penjualan (Bulan Ini)
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {sales ? formatCurrency(sales.total_revenue) : "-"}
          </p>
          <div className="mt-4 flex items-center text-sm">
            <Badge variant="success" className="mr-2">
              +12.5%
            </Badge>
            <span className="text-gray-500 text-xs">vs bulan lalu</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-gradient-to-br from-white to-green-50 p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-green-200 opacity-30" />
          <div className="inline-flex p-3 rounded-2xl bg-green-100 border border-green-200 mb-3">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-600">
            Pelanggan Baru
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {customers ? customers.new_customers : "-"}
          </p>
          <div className="mt-4 flex items-center text-sm">
            <Badge variant="info" className="mr-2">
              Aktif: {customers?.active_customers || 0}
            </Badge>
            <span className="text-gray-500 text-xs">tumbuh konsisten</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-gradient-to-br from-white to-orange-50 p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-orange-200 opacity-30" />
          <div className="inline-flex p-3 rounded-2xl bg-orange-100 border border-orange-200 mb-3">
            <Package className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-600">Valuasi Stok</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {inventory ? formatCurrency(inventory.valuation) : "-"}
          </p>
          <div className="mt-4 flex items-center text-sm">
            {inventory && inventory.low_stock_items > 0 && (
              <Badge variant="warning" className="mr-2">
                {inventory.low_stock_items} Stok Menipis
              </Badge>
            )}
            <span className="text-gray-500 text-xs">perlu restock segera</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Sales Section */}
        <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Performa Penjualan</h3>
            <Link
              href="/admin/reports/sales"
              className="text-xs font-medium text-primary-600 hover:underline"
            >
              Lihat Detail
            </Link>
          </div>
          <div className="p-6">
            <div className="h-48 w-full flex items-end gap-1">
              {sales?.performance ? (
                sales.performance.map((item, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary-100 rounded-t hover:bg-primary-200 transition-all group relative"
                    style={{
                      height: `${(item.amount / Math.max(...sales.performance.map((p) => p.amount))) * 100}%`,
                    }}
                  >
                    <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded z-10 whitespace-nowrap">
                      {formatCurrency(item.amount)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm italic">
                  Data belum tersedia
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-between text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
              <span>Mulai</span>
              <span>Tren Penjualan Terakhir</span>
              <span>Sekarang</span>
            </div>
          </div>
        </div>

        {/* Growth Section */}
        <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              Pertumbuhan Pelanggan
            </h3>
            <Link
              href="/admin/reports/customers"
              className="text-xs font-medium text-primary-600 hover:underline"
            >
              Lihat Detail
            </Link>
          </div>
          <div className="p-6">
            <div className="h-48 w-full flex items-end gap-1">
              {customers?.growth_performance ? (
                customers.growth_performance.map((item, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-secondary-100 rounded-t hover:bg-secondary-200 transition-all group relative"
                    style={{
                      height: `${(item.count / Math.max(...customers.growth_performance.map((p) => p.count))) * 100}%`,
                    }}
                  >
                    <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded z-10 whitespace-nowrap">
                      {item.count} User
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm italic">
                  Data belum tersedia
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-between text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
              <span>Awal Bulan</span>
              <span>Akuisisi User Baru</span>
              <span>Akhir Bulan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links to All Reports */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Laporan Produk",
            href: "/admin/reports/products",
            count: "Worst Performers, Best Sellers",
          },
          {
            label: "Laporan Kategori",
            href: "/admin/reports/categories",
            count: "Revenue by Category",
          },
          {
            label: "Laporan Voucher",
            href: "/admin/reports/vouchers",
            count: "Usage & ROI",
          },
          {
            label: "Laporan Inventori",
            href: "/admin/reports/inventory",
            count: "Stock Movement, Valuation",
          },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group p-5 rounded-2xl border-2 border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-lg transition-all"
          >
            <p className="font-bold text-gray-900 group-hover:text-emerald-700">
              {link.label}
            </p>
            <p className="mt-1 text-xs text-gray-500">{link.count}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function AdminReportsClient({
  initialData,
}: AdminReportsClientProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-lg">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-emerald-600 animate-spin" />
            <p className="text-base font-medium text-gray-600">
              Mempersiapkan laporan...
            </p>
          </div>
        </div>
      }
    >
      <AdminReportsContent initialData={initialData} />
    </Suspense>
  );
}
