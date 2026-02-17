"use client";

import { User, PaginatedResponse } from "@repo/shared";
import {
  Users,
  Download,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  UserX,
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

interface AdminCustomersClientProps {
  initialData: PaginatedResponse<User> | null;
}

function AdminCustomersContent({ initialData }: AdminCustomersClientProps) {
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
    router.push(`/admin/customers?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-2.5 shadow-sm border border-green-100/50 mb-4">
              <Users className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">
                Manajemen Pelanggan
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-gray-900 bg-clip-text text-transparent font-heading">
              Pelanggan
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Kelola data pelanggan dan riwayat aktivitas mereka
            </p>
          </div>
          <Button variant="outline" size="md" className="rounded-2xl">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              label="Cari Pelanggan"
              type="text"
              placeholder="Nama, email atau nomor telepon..."
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

      {/* Customers Table */}
      <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>No. Telepon</TableHead>
              <TableHead>Odoo ID</TableHead>
              <TableHead>Bergabung</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData?.items && initialData.items.length > 0 ? (
              initialData.items.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-bold text-gray-900">
                    {customer.full_name || "Tanpa Nama"}
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className="bg-gray-100 text-gray-700"
                    >
                      {customer.odoo_user_id}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(customer.created_at).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={customer.email_verified ? "success" : "warning"}
                    >
                      {customer.email_verified ? "Terverifikasi" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/admin/customers/${customer.id}`}>
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
                  <UserX className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-base font-medium text-gray-600">
                    {initialData
                      ? "Tidak ada pelanggan ditemukan"
                      : "Gagal memuat data pelanggan"}
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
                  router.push(`/admin/customers?${params.toString()}`);
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
                  router.push(`/admin/customers?${params.toString()}`);
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

export default function AdminCustomersClient({
  initialData,
}: AdminCustomersClientProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-lg">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-green-600 animate-spin" />
            <p className="text-base font-medium text-gray-600">
              Memuat data pelanggan...
            </p>
          </div>
        </div>
      }
    >
      <AdminCustomersContent initialData={initialData} />
    </Suspense>
  );
}
