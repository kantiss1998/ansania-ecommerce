"use client";

import { Category, PaginatedResponse } from "@repo/shared";
import { List, Plus, Edit2, Loader2, FolderX } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";

interface ExtendedCategory extends Category {
  products_count?: number;
}

interface AdminCategoriesClientProps {
  initialData: PaginatedResponse<Category> | null;
}

function AdminCategoriesContent({ initialData }: AdminCategoriesClientProps) {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 px-5 py-2.5 shadow-sm border border-orange-100/50 mb-4">
              <List className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-700">
                Manajemen Kategori
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-orange-800 to-gray-900 bg-clip-text text-transparent font-heading">
              Kategori Produk
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Kelola kategori produk dan pengelompokan dengan mudah
            </p>
          </div>
          <Link href="/admin/categories/create">
            <Button
              variant="gradient"
              size="md"
              className="shadow-lg hover:shadow-xl rounded-2xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kategori
            </Button>
          </Link>
        </div>
      </div>

      {/* Categories Table */}
      <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Kategori</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Produk</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData?.items && initialData.items.length > 0 ? (
              initialData.items.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-bold text-gray-900">
                    {category.name}
                  </TableCell>
                  <TableCell className="text-gray-600 font-mono">
                    {category.slug}
                  </TableCell>
                  <TableCell>
                    {(category as ExtendedCategory).products_count || 0}
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.is_active ? "success" : "default"}>
                      {category.is_active ? "Aktif" : "Non-aktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Link href={`/admin/categories/${category.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                        >
                          <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-16 text-center">
                  <FolderX className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-base font-medium text-gray-600">
                    {initialData
                      ? "Tidak ada kategori ditemukan"
                      : "Gagal memuat data kategori"}
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
      </div>
    </div>
  );
}

export default function AdminCategoriesClient({
  initialData,
}: AdminCategoriesClientProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-lg">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-orange-600 animate-spin" />
            <p className="text-base font-medium text-gray-600">
              Memuat kategori...
            </p>
          </div>
        </div>
      }
    >
      <AdminCategoriesContent initialData={initialData} />
    </Suspense>
  );
}
