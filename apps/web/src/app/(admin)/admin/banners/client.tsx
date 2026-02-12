"use client";

import { Banner } from "@repo/shared";
import Image from "next/image";
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

interface AdminBannersClientProps {
  initialData: Banner[] | null;
}

function AdminBannersContent({ initialData }: AdminBannersClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Banners</h2>
          <p className="mt-1 text-sm text-gray-600">
            Kelola banner promosi di halaman utama dan halaman lainnya
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/banners/create">
            <Button variant="primary" size="md">
              Tambah Banner
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Preview</TableHead>
              <TableHead>Informasi Banner</TableHead>
              <TableHead>Posisi</TableHead>
              <TableHead className="text-center">Urutan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData && initialData.length > 0 ? (
              initialData.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <div className="relative h-20 w-36 overflow-hidden rounded border border-gray-200 bg-gray-50">
                      <Image
                        src={banner.image_url}
                        alt={banner.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">
                        {banner.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">
                        {banner.link_url || "No Link"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="info" className="capitalize">
                      {banner.position.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {banner.sequence}
                  </TableCell>
                  <TableCell>
                    <Badge variant={banner.is_active ? "success" : "default"}>
                      {banner.is_active ? "Aktif" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/admin/banners/${banner.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-gray-500"
                >
                  {initialData
                    ? "Tidak ada banner ditemukan"
                    : "Gagal memuat data banner"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function AdminBannersClient({
  initialData,
}: AdminBannersClientProps) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-500">Memuat banner...</div>
      }
    >
      <AdminBannersContent initialData={initialData} />
    </Suspense>
  );
}
