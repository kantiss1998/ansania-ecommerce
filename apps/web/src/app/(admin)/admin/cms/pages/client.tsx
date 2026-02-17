"use client";

import { CMSPage } from "@repo/shared";
import { FileText, Plus, Edit2, Trash2, Loader2, FileX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

import { Button } from "@/components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { adminCmsService } from "@/services/adminCmsService";

interface ExtendedCMSPage extends CMSPage {
  meta_title?: string;
  metadata?: { meta_title?: string };
}

interface PagesClientProps {
  initialData: CMSPage[];
}

function PagesContent({ initialData }: PagesClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus halaman ini?")) return;

    setIsDeleting(id);
    try {
      await adminCmsService.deletePage(id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete page:", error);
      alert("Gagal menghapus halaman");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-5 py-2.5 shadow-sm border border-indigo-100/50 mb-4">
              <FileText className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-700">
                CMS Pages
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 bg-clip-text text-transparent font-heading">
              Pages Management
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Atur halaman statis dan SEO konten
            </p>
          </div>
          <Link href="/admin/cms/pages/create">
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
              <TableHead>Judul</TableHead>
              <TableHead>URL Slug</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.length > 0 ? (
              initialData.map((page) => (
                <TableRow key={page.id}>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {page.title}
                    </div>
                    <div className="text-xs text-gray-400 truncate max-w-[200px]">
                      {(page as ExtendedCMSPage).meta_title ||
                        (page as ExtendedCMSPage).metadata?.meta_title ||
                        ""}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-600">
                      /{page.slug}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(page.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {page.is_published ? (
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                        Draft
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Link href={`/admin/cms/pages/${page.id}`}>
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
                        className="text-red-600 hover:bg-red-50 rounded-xl"
                        isLoading={isDeleting === page.id}
                        onClick={() => handleDelete(page.id)}
                      >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-16 text-center">
                  <FileX className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-base font-medium text-gray-600">
                    Belum ada halaman.
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

export default function PagesClient({ initialData }: PagesClientProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-lg">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-indigo-600 animate-spin" />
            <p className="text-base font-medium text-gray-600">
              Memuat halaman...
            </p>
          </div>
        </div>
      }
    >
      <PagesContent initialData={initialData} />
    </Suspense>
  );
}
