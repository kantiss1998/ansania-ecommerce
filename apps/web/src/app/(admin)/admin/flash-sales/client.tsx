"use client";

import { PaginatedResponse, FlashSale } from "@repo/shared";
import { Zap, Plus, Edit2, Trash2, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { flashSaleService } from "@/services/flashSaleService";

interface AdminFlashSalesClientProps {
  initialData: PaginatedResponse<FlashSale>;
}

function FlashSalesContent({ initialData }: AdminFlashSalesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus flash sale ini?")) return;

    setIsDeleting(id);
    try {
      await flashSaleService.deleteFlashSale(id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete flash sale:", error);
      alert("Gagal menghapus flash sale");
    } finally {
      setIsDeleting(null);
    }
  };

  const StatusBadge = ({
    start,
    end,
    active,
  }: {
    start: string;
    end: string;
    active: boolean;
  }) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (!active) return <Badge variant="default">Non-aktif</Badge>;
    if (now < startDate) return <Badge variant="warning">Akan Datang</Badge>;
    if (now > endDate) return <Badge variant="error">Berakhir</Badge>;
    return <Badge variant="success">Berlangsung</Badge>;
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-50 to-orange-50 px-5 py-2.5 shadow-sm border border-red-100/50 mb-4">
              <Zap className="h-4 w-4 text-red-600" />
              <span className="text-sm font-semibold text-red-700">
                Manajemen Flash Sale
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-800 to-gray-900 bg-clip-text text-transparent font-heading">
              Flash Sales
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Kelola event flash sale dan produk promo
            </p>
          </div>
          <Link href="/admin/flash-sales/create">
            <Button
              variant="gradient"
              size="md"
              className="shadow-lg hover:shadow-xl rounded-2xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Buat Flash Sale
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Event</TableHead>
              <TableHead>Periode</TableHead>
              <TableHead>Produk</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.items && initialData.items.length > 0 ? (
              initialData.items.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    <div>
                      <p className="font-bold text-gray-900">{sale.name}</p>
                      <p className="text-xs text-gray-500 max-w-[200px] truncate">
                        {sale.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-gray-600">
                      <p>{new Date(sale.start_date).toLocaleString("id-ID")}</p>
                      <p className="text-gray-400">s/d</p>
                      <p>{new Date(sale.end_date).toLocaleString("id-ID")}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {sale.products?.length || 0} Item
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      start={sale.start_date}
                      end={sale.end_date}
                      active={sale.is_active}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Link href={`/admin/flash-sales/${sale.id}`}>
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
                        isLoading={isDeleting === sale.id}
                        onClick={() => handleDelete(sale.id)}
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
                  <Sparkles className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-base font-medium text-gray-600">
                    Belum ada flash sale yang dibuat.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        {initialData.pagination && (
          <Pagination
            currentPage={initialData.pagination.page}
            totalPages={initialData.pagination.totalPages}
            onPageChange={(page) => {
              const params = new URLSearchParams(searchParams);
              params.set("page", page.toString());
              router.push(`/admin/flash-sales?${params.toString()}`);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function AdminFlashSalesClient({
  initialData,
}: AdminFlashSalesClientProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-lg">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-red-600 animate-spin" />
            <p className="text-base font-medium text-gray-600">
              Memuat flash sales...
            </p>
          </div>
        </div>
      }
    >
      <FlashSalesContent initialData={initialData} />
    </Suspense>
  );
}
