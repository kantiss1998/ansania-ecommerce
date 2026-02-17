"use client";

import { StockItem, PaginatedResponse } from "@repo/shared";
import {
  Archive,
  RefreshCw,
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PackageX,
} from "lucide-react";
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
import apiClient from "@/lib/api";

interface AdminStockClientProps {
  initialData: PaginatedResponse<StockItem> | null;
}

function AdminStockContent({ initialData }: AdminStockClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`/admin/stock?${params.toString()}`);
  };

  const handleFilterType = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type) {
      params.set("type", type);
    } else {
      params.delete("type");
    }
    params.set("page", "1");
    router.push(`/admin/stock?${params.toString()}`);
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const response = await apiClient.post("/admin/stock/sync");

      if (response.status === 200) {
        alert("Sinkronisasi stok berhasil dimulai di background.");
        router.refresh();
      } else {
        alert("Gagal memulai sinkronisasi stok.");
      }
    } catch (error) {
      console.error("Sync error:", error);
      alert("Terjadi kesalahan saat sinkronisasi.");
    } finally {
      setIsSyncing(false);
    }
  };

  const currentType = searchParams.get("type") || "";

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-50 to-cyan-50 px-5 py-2.5 shadow-sm border border-teal-100/50 mb-4">
              <Archive className="h-4 w-4 text-teal-600" />
              <span className="text-sm font-semibold text-teal-700">
                Manajemen Stok
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-teal-800 to-gray-900 bg-clip-text text-transparent font-heading">
              Stok (Inventori)
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Pantau level stok produk yang sinkron dengan Odoo
            </p>
          </div>
          <Button
            variant="outline"
            size="md"
            className="rounded-2xl"
            onClick={handleSync}
            disabled={isSyncing}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
            />
            {isSyncing ? "Sinkronisasi..." : "Sinkron dari Odoo"}
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1 flex gap-3">
            <div className="flex-1">
              <Input
                label="Cari SKU atau Nama"
                type="text"
                placeholder="Contoh: ANS-001..."
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
          <div className="w-full sm:w-72">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Filter Kondisi
            </label>
            <div className="flex rounded-2xl border-2 border-gray-200 p-1.5 bg-gray-50">
              <button
                onClick={() => handleFilterType("")}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${!currentType ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md" : "text-gray-600 hover:text-gray-900"}`}
              >
                Semua
              </button>
              <button
                onClick={() => handleFilterType("low_stock")}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${currentType === "low_stock" ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md" : "text-gray-600 hover:text-gray-900"}`}
              >
                Menipis
              </button>
              <button
                onClick={() => handleFilterType("out_of_stock")}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${currentType === "out_of_stock" ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md" : "text-gray-600 hover:text-gray-900"}`}
              >
                Habis
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Produk & Varian</TableHead>
              <TableHead className="text-right">Stok</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Terakhir Sinkron</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData?.items && initialData.items.length > 0 ? (
              initialData.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm font-bold text-gray-900">
                    {item.sku}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <div className="flex gap-2 text-xs text-gray-500">
                        {item.color && <span>Warna: {item.color}</span>}
                        {item.size && <span>Ukuran: {item.size}</span>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-gray-900">
                    {item.stock}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.stock <= 0
                          ? "error"
                          : item.stock <= 5
                            ? "warning"
                            : "success"
                      }
                    >
                      {item.stock <= 0
                        ? "Habis"
                        : item.stock <= 5
                          ? "Menipis"
                          : "Tersedia"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {new Date(item.last_sync_at).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-teal-600 hover:bg-teal-50 rounded-xl"
                    >
                      <FileText className="mr-1.5 h-3.5 w-3.5" />
                      Log Stok
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center">
                  <PackageX className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-base font-medium text-gray-600">
                    {initialData
                      ? "Tidak ada data stok ditemukan"
                      : "Gagal memuat data stok"}
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
                  router.push(`/admin/stock?${params.toString()}`);
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
                  router.push(`/admin/stock?${params.toString()}`);
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

export default function AdminStockClient({
  initialData,
}: AdminStockClientProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-lg">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-teal-600 animate-spin" />
            <p className="text-base font-medium text-gray-600">
              Memuat data inventori...
            </p>
          </div>
        </div>
      }
    >
      <AdminStockContent initialData={initialData} />
    </Suspense>
  );
}
