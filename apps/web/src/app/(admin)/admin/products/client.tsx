"use client";

import { Product, PaginatedResponse } from "@repo/shared";
import {
  Package,
  Plus,
  RefreshCw,
  Search,
  Edit2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Image from "next/image";
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

interface AdminProductsClientProps {
  initialData: PaginatedResponse<Product> | null;
}

function AdminProductsContent({ initialData }: AdminProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`/admin/products?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 px-5 py-2.5 shadow-sm border border-purple-100/50 mb-4">
              <Package className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">
                Manajemen Produk
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent font-heading">
              Katalog Produk
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Kelola katalog produk, stok, dan harga dengan mudah
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/sync">
              <Button variant="outline" size="md" className="rounded-2xl">
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Odoo
              </Button>
            </Link>
            <Link href="/admin/products/create">
              <Button
                variant="gradient"
                size="md"
                className="shadow-lg hover:shadow-xl rounded-2xl"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Produk
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              label="Cari Produk"
              type="text"
              placeholder="Nama produk atau SKU..."
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

      {/* Products Table */}
      <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Foto</TableHead>
              <TableHead>Produk</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Status Stok</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData?.items && initialData.items.length > 0 ? (
              initialData.items.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative h-14 w-14 overflow-hidden rounded-2xl border-2 border-gray-200 bg-gray-50 shadow-sm">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-6 w-6 text-gray-300" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-bold text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500 font-mono">
                        {product.slug}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {product.category?.name || "Uncategorized"}
                    </span>
                  </TableCell>
                  <TableCell className="font-bold text-gray-900">
                    {formatCurrency(product.selling_price)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.stock_status === "in_stock"
                          ? "success"
                          : product.stock_status === "out_of_stock"
                            ? "error"
                            : "warning"
                      }
                    >
                      {product.stock_status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Link href={`/admin/products/${product.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                        >
                          <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-indigo-600 rounded-xl"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center">
                  <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-base font-medium text-gray-600">
                    {initialData
                      ? "Tidak ada produk ditemukan"
                      : "Gagal memuat data produk"}
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
                  router.push(`/admin/products?${params.toString()}`);
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
                  router.push(`/admin/products?${params.toString()}`);
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

export default function AdminProductsClient({
  initialData,
}: AdminProductsClientProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-lg">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-purple-600 animate-spin" />
            <p className="text-base font-medium text-gray-600">
              Memuat katalog produk...
            </p>
          </div>
        </div>
      }
    >
      <AdminProductsContent initialData={initialData} />
    </Suspense>
  );
}
