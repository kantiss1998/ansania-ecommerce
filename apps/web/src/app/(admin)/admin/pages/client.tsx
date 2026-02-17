"use client";

import { CMSPage } from "@repo/shared";
import { FileText, Plus, Edit2, Eye, Loader2, FileMinus2 } from "lucide-react";
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

interface AdminPagesClientProps {
  initialData: CMSPage[] | null;
}

function AdminPagesContent({ initialData }: AdminPagesClientProps) {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-50 to-gray-50 px-5 py-2.5 shadow-sm border border-slate-100/50 mb-4">
              <FileText className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-semibold text-slate-700">
                Manajemen Halaman
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 bg-clip-text text-transparent font-heading">
              Halaman Statis (CMS)
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Kelola konten halaman statis seperti About Us, Terms, dan Policy
            </p>
          </div>
          <Link href="/admin/pages/create">
            <Button
              variant="gradient"
              size="md"
              className="shadow-lg hover:shadow-xl rounded-2xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Buat Halaman
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul Halaman</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Terakhir Update</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData && initialData.length > 0 ? (
              initialData.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-bold text-gray-900">
                    {page.title}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                      /{page.slug}
                    </code>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(page.updated_at).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={page.is_published ? "success" : "default"}>
                      {page.is_published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Link href={`/admin/pages/${page.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                        >
                          <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                          Edit
                        </Button>
                      </Link>
                      <a
                        href={`/page/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-xl"
                        >
                          <Eye className="mr-1.5 h-3.5 w-3.5" />
                          Preview
                        </Button>
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-16 text-center">
                  <FileMinus2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-base font-medium text-gray-600">
                    {initialData
                      ? "Tidak ada halaman ditemukan"
                      : "Gagal memuat data halaman"}
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

export default function AdminPagesClient({
  initialData,
}: AdminPagesClientProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-lg">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-slate-600 animate-spin" />
            <p className="text-base font-medium text-gray-600">
              Memuat halaman CMS...
            </p>
          </div>
        </div>
      }
    >
      <AdminPagesContent initialData={initialData} />
    </Suspense>
  );
}
