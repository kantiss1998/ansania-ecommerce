"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import apiClient from "@/lib/api";

interface VoucherStats {
  voucher_id: number;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  usage_count: number;
  usage_limit: number;
  total_discount_given: number;
  total_revenue_generated: number;
  unique_users: number;
  avg_order_value: number;
  conversion_rate: number;
  status: string;
}

interface AdminVoucherStatsClientProps {
  voucherId: number;
}

export default function AdminVoucherStatsClient({
  voucherId,
}: AdminVoucherStatsClientProps) {
  const [stats, setStats] = useState<VoucherStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVoucherStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<{ data: VoucherStats }>(
        `/admin/vouchers/${voucherId}/stats`,
      );
      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to fetch voucher stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, [voucherId]);

  useEffect(() => {
    fetchVoucherStats();
  }, [voucherId, fetchVoucherStats]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-500">
        Data voucher tidak ditemukan
      </div>
    );
  }

  const usagePercentage =
    stats.usage_limit > 0 ? (stats.usage_count / stats.usage_limit) * 100 : 0;

  const roi =
    stats.total_discount_given > 0
      ? ((stats.total_revenue_generated - stats.total_discount_given) /
          stats.total_discount_given) *
        100
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/vouchers/${voucherId}`}
              className="text-gray-400 hover:text-gray-900"
            >
              ← Back
            </Link>
            <h2 className="text-xl font-semibold text-gray-900">
              Voucher Statistics
            </h2>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <span className="font-mono text-lg font-bold text-primary-600">
              {stats.code}
            </span>
            <Badge
              variant={
                stats.discount_type === "percentage" ? "success" : "info"
              }
            >
              {stats.discount_type === "percentage"
                ? `${stats.discount_value}%`
                : `Rp ${stats.discount_value.toLocaleString("id-ID")}`}
            </Badge>
          </div>
        </div>
        <Link href={`/admin/vouchers/${voucherId}/history`}>
          <Button variant="outline">View History</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Total Usage</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stats.usage_count}
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-primary-600"
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {stats.usage_limit > 0 ? `${stats.usage_limit} limit` : "Unlimited"}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Unique Users</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stats.unique_users}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            customers used this voucher
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Total Discount Given</p>
          <p className="mt-2 text-3xl font-bold text-error-600">
            Rp {stats.total_discount_given.toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            total savings for customers
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Revenue Generated</p>
          <p className="mt-2 text-3xl font-bold text-success-600">
            Rp {stats.total_revenue_generated.toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-xs text-gray-500">from voucher orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Average Order Value</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            Rp {stats.avg_order_value.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Conversion Rate</p>
          <p className="mt-2 text-2xl font-bold text-primary-600">
            {stats.conversion_rate.toFixed(2)}%
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">ROI</p>
          <p
            className={`mt-2 text-2xl font-bold ${roi >= 0 ? "text-success-600" : "text-error-600"}`}
          >
            {roi >= 0 ? "+" : ""}
            {roi.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Performance Insights
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            <p className="text-gray-700">
              Voucher ini telah digunakan oleh{" "}
              <strong>{stats.unique_users}</strong> pelanggan unik
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            <p className="text-gray-700">
              Rata-rata nilai pesanan dengan voucher ini adalah{" "}
              <strong>
                Rp {stats.avg_order_value.toLocaleString("id-ID")}
              </strong>
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            <p className="text-gray-700">
              ROI voucher:{" "}
              <strong
                className={roi >= 0 ? "text-success-600" : "text-error-600"}
              >
                {roi >= 0 ? "+" : ""}
                {roi.toFixed(1)}%
              </strong>{" "}
              -{" "}
              {roi >= 100
                ? "Sangat Efektif!"
                : roi >= 50
                  ? "Efektif"
                  : roi >= 0
                    ? "Cukup Efektif"
                    : "Perlu Evaluasi"}
            </p>
          </div>
          {stats.usage_limit > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-primary-600">•</span>
              <p className="text-gray-700">
                Penggunaan: <strong>{usagePercentage.toFixed(1)}%</strong> dari
                limit ({stats.usage_count}/{stats.usage_limit})
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
