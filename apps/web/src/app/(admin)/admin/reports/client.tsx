"use client";

import {
  SalesReportData,
  CustomerReportData,
  InventoryReportData,
} from "@repo/shared";
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
      <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white">
        <p className="text-gray-500">Gagal memuat data laporan.</p>
      </div>
    );
  }

  const { sales, customers, inventory } = initialData;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Reports & Analytics
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Analisis performa bisnis, perilaku pelanggan, dan status inventori
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="md">
            Download PDF Summary
          </Button>
        </div>
      </div>

      {/* Top Summaries */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary-50 opacity-50" />
          <h3 className="text-sm font-medium text-gray-500">
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

        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-secondary-50 opacity-50" />
          <h3 className="text-sm font-medium text-gray-500">Pelanggan Baru</h3>
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

        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-error-50 opacity-50" />
          <h3 className="text-sm font-medium text-gray-500">Valuasi Stok</h3>
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
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
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
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
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
            className="group p-4 rounded-xl border border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50 transition-all"
          >
            <p className="font-medium text-gray-900 group-hover:text-primary-700">
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
        <div className="p-8 text-center text-gray-500">
          Mempersiapkan laporan...
        </div>
      }
    >
      <AdminReportsContent initialData={initialData} />
    </Suspense>
  );
}
