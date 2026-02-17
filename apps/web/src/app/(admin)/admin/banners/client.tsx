"use client";

import { Banner } from "@repo/shared";
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Loader2,
  ImageOff,
} from "lucide-react";
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
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-50 to-sky-50 px-5 py-2.5 shadow-sm border border-cyan-100/50 mb-4">
              <ImageIcon className="h-4 w-4 text-cyan-600" />
              <span className="text-sm font-semibold text-cyan-700">
                Manajemen Banner
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-cyan-800 to-gray-900 bg-clip-text text-transparent font-heading">
              Banners
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Kelola banner promosi di halaman utama dan halaman lainnya
            </p>
          </div>
          <Link href="/admin/banners/create">
            <Button
              variant="gradient"
              size="md"
              className="shadow-lg hover:shadow-xl rounded-2xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Banner
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                      >
                        <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center">
                  <ImageOff className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-base font-medium text-gray-600">
                    {initialData
                      ? "Tidak ada banner ditemukan"
                      : "Gagal memuat data banner"}
                  </p>
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
        <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-lg">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-cyan-600 animate-spin" />
            <p className="text-base font-medium text-gray-600">
              Memuat banner...
            </p>
          </div>
        </div>
      }
    >
      <AdminBannersContent initialData={initialData} />
    </Suspense>
  );
}
