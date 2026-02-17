"use client";

import { DashboardStats } from "@repo/shared";
import { ORDER_STATUS } from "@repo/shared/constants";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  TrendingDown,
  Loader2,
  ArrowUpRight,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { formatCurrency } from "@/lib/utils";

interface AdminDashboardClientProps {
  initialStats: DashboardStats | null;
}

function AdminDashboardContent({ stats }: { stats: DashboardStats | null }) {
  if (!stats) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white">
        <div className="text-center">
          <p className="text-base text-gray-600">
            Gagal memuat statistik dashboard.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Pendapatan",
      value: formatCurrency(stats.overview.totalSales),
      change: "+8%",
      trend: "up",
      icon: <DollarSign className="h-6 w-6" />,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
    },
    {
      title: "Total Pesanan",
      value: stats.overview.totalOrders.toString(),
      change: "+12%",
      trend: "up",
      icon: <ShoppingCart className="h-6 w-6" />,
      gradient: "from-indigo-500 to-blue-500",
      bgGradient: "from-indigo-50 to-blue-50",
    },
    {
      title: "Rata-rata Order",
      value: formatCurrency(stats.overview.avgOrderValue),
      change: "+2%",
      trend: "up",
      icon: <TrendingUp className="h-6 w-6" />,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
    },
    {
      title: "Stok Menipis",
      value: stats.inventory.lowStockCount.toString(),
      change:
        stats.inventory.outOfStockCount > 0
          ? `${stats.inventory.outOfStockCount} Habis`
          : "Aman",
      trend: stats.inventory.lowStockCount > 5 ? "down" : "up",
      icon: <Package className="h-6 w-6" />,
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-50 to-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Background gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`inline-flex rounded-2xl bg-gradient-to-br ${stat.bgGradient} p-3 shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                  <div
                    className={`bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}
                  >
                    {stat.icon}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-bold ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-5">
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Pesanan Terbaru
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-600 font-bold border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4">No. Order</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {stats.activity.recentOrders.length > 0 ? (
                stats.activity.recentOrders.map((order) => (
                  <tr
                    key={order.order_number}
                    className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200"
                  >
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {order.user?.full_name || "Pelanggan"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(order.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          order.status === ORDER_STATUS.PAID ||
                          order.status === ORDER_STATUS.DELIVERED
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : order.status === ORDER_STATUS.PENDING_PAYMENT
                              ? "bg-orange-100 text-orange-700 border border-orange-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {order.status === ORDER_STATUS.PAID
                          ? "Dibayar"
                          : order.status === ORDER_STATUS.PENDING_PAYMENT
                            ? "Menunggu Pembayaran"
                            : order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/admin/orders/${order.order_number}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">Tidak ada pesanan terbaru</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardClient({
  initialStats,
}: AdminDashboardClientProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-lg">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-indigo-600 animate-spin" />
            <p className="text-base font-medium text-gray-600">
              Memuat dashboard...
            </p>
          </div>
        </div>
      }
    >
      <AdminDashboardContent stats={initialStats} />
    </Suspense>
  );
}
