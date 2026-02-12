"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

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
import apiClient from "@/lib/api";

interface VoucherReport {
  voucher_id: number;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  usage_count: number;
  usage_limit: number;
  total_discount_given: number;
  total_revenue_generated: number;
  status: "active" | "expired" | "upcoming";
}

export default function AdminVoucherReportClient() {
  const [data, setData] = useState<VoucherReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");

  const fetchVoucherReport = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<{ data: VoucherReport[] }>(
        `/admin/reports/vouchers${filter !== "all" ? `?status=${filter}` : ""}`,
      );
      setData(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch voucher report:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchVoucherReport();
  }, [fetchVoucherReport]);

  const totalDiscountGiven = data.reduce(
    (sum, item) => sum + item.total_discount_given,
    0,
  );
  const totalRevenueGenerated = data.reduce(
    (sum, item) => sum + item.total_revenue_generated,
    0,
  );
  const totalUsageCount = data.reduce((sum, item) => sum + item.usage_count, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Voucher Performance Report
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Analisis penggunaan dan efektivitas voucher
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Semua
            </Button>
            <Button
              variant={filter === "active" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter("active")}
            >
              Aktif
            </Button>
            <Button
              variant={filter === "expired" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter("expired")}
            >
              Expired
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Total Usage</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {totalUsageCount.toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-xs text-gray-500">voucher redemptions</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Total Discount Given</p>
          <p className="mt-2 text-3xl font-bold text-error-600">
            Rp {totalDiscountGiven.toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            total savings for customers
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Revenue Generated</p>
          <p className="mt-2 text-3xl font-bold text-success-600">
            Rp {totalRevenueGenerated.toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-xs text-gray-500">from voucher orders</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Voucher Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Total Discount</TableHead>
              <TableHead>Revenue Generated</TableHead>
              <TableHead>ROI</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((voucher) => {
                const usagePercentage =
                  voucher.usage_limit > 0
                    ? (voucher.usage_count / voucher.usage_limit) * 100
                    : 0;
                const roi =
                  voucher.total_discount_given > 0
                    ? ((voucher.total_revenue_generated -
                        voucher.total_discount_given) /
                        voucher.total_discount_given) *
                      100
                    : 0;

                return (
                  <TableRow key={voucher.voucher_id}>
                    <TableCell>
                      <span className="font-mono font-semibold text-primary-600">
                        {voucher.code}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">
                        {voucher.discount_type === "percentage"
                          ? `${voucher.discount_value}%`
                          : `Rp ${voucher.discount_value.toLocaleString("id-ID")}`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium">
                          {voucher.usage_count} / {voucher.usage_limit || "∞"}
                        </span>
                        {voucher.usage_limit > 0 && (
                          <div className="mt-1 h-2 w-20 rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-primary-600"
                              style={{
                                width: `${Math.min(usagePercentage, 100)}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-error-600">
                      Rp {voucher.total_discount_given.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-success-600">
                      Rp{" "}
                      {voucher.total_revenue_generated.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-semibold ${roi >= 0 ? "text-success-600" : "text-error-600"}`}
                      >
                        {roi >= 0 ? "+" : ""}
                        {roi.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          voucher.status === "active"
                            ? "success"
                            : voucher.status === "expired"
                              ? "error"
                              : "warning"
                        }
                      >
                        {voucher.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Link href={`/admin/vouchers/${voucher.voucher_id}`}>
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-12 text-center text-gray-500"
                >
                  Tidak ada data voucher.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
