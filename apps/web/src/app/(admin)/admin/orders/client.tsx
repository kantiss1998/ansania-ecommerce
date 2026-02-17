"use client";

import { Order, PaginatedResponse } from "@repo/shared";
import { ORDER_STATUS } from "@repo/shared/constants";
import {
  ShoppingCart,
  Download,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { formatCurrency } from "@/lib/utils";

interface ExtendedOrder extends Order {
  items_count?: number;
}

interface AdminOrdersClientProps {
  initialData: PaginatedResponse<Order> | null;
}

function AdminOrdersContent({ initialData }: AdminOrdersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "",
  );

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`/admin/orders?${params.toString()}`);
  };

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    params.set("page", "1");
    router.push(`/admin/orders?${params.toString()}`);
    setStatusFilter(status);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case ORDER_STATUS.PAID:
      case ORDER_STATUS.DELIVERED:
        return "success";
      case ORDER_STATUS.PENDING_PAYMENT:
        return "warning";
      case ORDER_STATUS.SHIPPED:
      case ORDER_STATUS.PROCESSING:
        return "info";
      case ORDER_STATUS.CANCELLED:
      case ORDER_STATUS.FAILED:
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case ORDER_STATUS.PAID:
        return "Dibayar";
      case ORDER_STATUS.PENDING_PAYMENT:
        return "Belum Dibayar";
      case ORDER_STATUS.PROCESSING:
        return "Diproses";
      case ORDER_STATUS.SHIPPED:
        return "Dikirim";
      case ORDER_STATUS.DELIVERED:
        return "Selesai";
      case ORDER_STATUS.CANCELLED:
        return "Dibatalkan";
      case ORDER_STATUS.REFUNDED:
        return "Dikembalikan";
      case ORDER_STATUS.FAILED:
        return "Gagal";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 px-5 py-2.5 shadow-sm border border-blue-100/50 mb-4">
              <ShoppingCart className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">
                Manajemen Pesanan
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent font-heading">
              Pesanan
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Kelola pesanan masuk dari pelanggan dengan mudah
            </p>
          </div>
          <Button variant="outline" size="md" className="rounded-2xl">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  label="Cari Pesanan"
                  type="text"
                  placeholder="Nomor order atau nama pelanggan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div className="mt-8">
                <Button
                  onClick={handleSearch}
                  variant="gradient"
                  className="rounded-2xl shadow-lg hover:shadow-xl"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Cari
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-56">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              <Filter className="inline h-4 w-4 mr-1.5" />
              Filter Status
            </label>
            <select
              className="w-full rounded-2xl border-2 border-gray-200 p-3 text-sm font-medium transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value={ORDER_STATUS.PENDING_PAYMENT}>
                Belum Dibayar
              </option>
              <option value={ORDER_STATUS.PAID}>Dibayar</option>
              <option value={ORDER_STATUS.PROCESSING}>Diproses</option>
              <option value={ORDER_STATUS.SHIPPED}>Dikirim</option>
              <option value={ORDER_STATUS.DELIVERED}>Selesai</option>
              <option value={ORDER_STATUS.CANCELLED}>Dibatalkan</option>
              <option value={ORDER_STATUS.REFUNDED}>Dikembalikan</option>
              <option value={ORDER_STATUS.FAILED}>Gagal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Order</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData?.items && initialData.items.length > 0 ? (
              initialData.items.map((order) => (
                <TableRow key={order.order_number}>
                  <TableCell className="font-bold text-gray-900">
                    {order.order_number}
                  </TableCell>
                  <TableCell>
                    {(order as ExtendedOrder).user?.full_name || "Pelanggan"}
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell>
                    {(order as ExtendedOrder).items_count || "-"}
                  </TableCell>
                  <TableCell className="font-bold text-gray-900">
                    {formatCurrency(order.total_amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/admin/orders/${order.order_number}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        Detail
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center">
                  <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-base font-medium text-gray-600">
                    {initialData
                      ? "Tidak ada pesanan ditemukan"
                      : "Gagal memuat data pesanan"}
                  </p>
                  {!initialData && (
                    <Button
                      onClick={() => window.location.reload()}
                      variant="gradient"
                      className="mt-4 rounded-2xl"
                    >
                      Coba Lagi
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {initialData?.pagination && initialData.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-5">
            <p className="text-sm font-medium text-gray-700">
              Menampilkan halaman{" "}
              <span className="font-bold text-gray-900">
                {initialData.pagination.page}
              </span>{" "}
              dari{" "}
              <span className="font-bold text-gray-900">
                {initialData.pagination.totalPages}
              </span>
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                disabled={initialData.pagination.page <= 1}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set(
                    "page",
                    (initialData.pagination.page - 1).toString(),
                  );
                  router.push(`/admin/orders?${params.toString()}`);
                }}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                disabled={
                  initialData.pagination.page >=
                  initialData.pagination.totalPages
                }
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set(
                    "page",
                    (initialData.pagination.page + 1).toString(),
                  );
                  router.push(`/admin/orders?${params.toString()}`);
                }}
              >
                Berikutnya
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminOrdersClient({
  initialData,
}: AdminOrdersClientProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-lg">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-spin" />
            <p className="text-base font-medium text-gray-600">
              Memuat pesanan...
            </p>
          </div>
        </div>
      }
    >
      <AdminOrdersContent initialData={initialData} />
    </Suspense>
  );
}
