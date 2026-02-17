"use client";

import { PaginatedResponse, Voucher } from "@repo/shared";
import { VOUCHER_TYPE } from "@repo/shared/constants";
import {
  Ticket,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  TicketX,
  Percent,
} from "lucide-react";
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
import { adminVoucherService } from "@/services/adminVoucherService";

interface AdminVouchersClientProps {
  initialData: PaginatedResponse<Voucher>;
}

function VouchersContent({ initialData }: AdminVouchersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus voucher ini?")) return;

    setIsDeleting(id);
    try {
      await adminVoucherService.deleteVoucher(id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete voucher:", error);
      alert("Gagal menghapus voucher");
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
    if (now > endDate) return <Badge variant="error">Kadaluarsa</Badge>;
    return <Badge variant="success">Aktif</Badge>;
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-50 to-rose-50 px-5 py-2.5 shadow-sm border border-pink-100/50 mb-4">
              <Ticket className="h-4 w-4 text-pink-600" />
              <span className="text-sm font-semibold text-pink-700">
                Manajemen Voucher
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-pink-800 to-gray-900 bg-clip-text text-transparent font-heading">
              Voucher & Kupon
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Kelola kode promo dan diskon untuk pelanggan
            </p>
          </div>
          <Link href="/admin/vouchers/create">
            <Button
              variant="gradient"
              size="md"
              className="shadow-lg hover:shadow-xl rounded-2xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Buat Voucher
            </Button>
          </Link>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Tipe Diskon</TableHead>
              <TableHead>Periode</TableHead>
              <TableHead>Penggunaan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.items.length > 0 ? (
              initialData.items.map((voucher) => (
                <TableRow key={voucher.id}>
                  <TableCell>
                    <div>
                      <p className="font-bold text-gray-900">{voucher.code}</p>
                      <p className="text-xs text-gray-500 max-w-[200px] truncate">
                        {voucher.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {voucher.discount_type === VOUCHER_TYPE.PERCENTAGE ? (
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 px-3 py-1.5 border border-purple-100">
                          <Percent className="h-3.5 w-3.5 text-purple-600" />
                          <span className="font-bold text-purple-700">
                            {voucher.discount_amount}% OFF
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1.5 border border-green-100">
                          <span className="font-bold text-green-700">
                            Rp {voucher.discount_amount.toLocaleString("id-ID")}{" "}
                            OFF
                          </span>
                        </div>
                      )}
                      {(voucher.min_purchase || 0) > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Min. Blj: Rp{" "}
                          {voucher.min_purchase?.toLocaleString("id-ID")}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-gray-600">
                      <p>
                        {new Date(voucher.start_date).toLocaleDateString(
                          "id-ID",
                        )}
                      </p>
                      <p className="text-gray-400">s/d</p>
                      <p>
                        {new Date(voucher.end_date).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="font-medium">{voucher.usage_count}</span>
                      <span className="text-gray-500">
                        {" "}
                        / {voucher.usage_limit || "∞"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      start={voucher.start_date}
                      end={voucher.end_date}
                      active={voucher.is_active}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Link href={`/admin/vouchers/${voucher.id}`}>
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
                        isLoading={isDeleting === voucher.id}
                        onClick={() => handleDelete(voucher.id)}
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
                <TableCell colSpan={6} className="py-16 text-center">
                  <TicketX className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-base font-medium text-gray-600">
                    Belum ada voucher yang dibuat.
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
              router.push(`/admin/vouchers?${params.toString()}`);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function AdminVouchersClient({
  initialData,
}: AdminVouchersClientProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-lg">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-pink-600 animate-spin" />
            <p className="text-base font-medium text-gray-600">
              Memuat voucher...
            </p>
          </div>
        </div>
      }
    >
      <VouchersContent initialData={initialData} />
    </Suspense>
  );
}
