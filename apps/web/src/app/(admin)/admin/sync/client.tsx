"use client";

import { SyncStatus, SyncLog } from "@repo/shared";
import {
  RefreshCw,
  Settings,
  Package,
  Archive,
  FolderTree,
  Truck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import apiClient from "@/lib/api";

interface AdminSyncProps {
  status: SyncStatus;
  recentLogs: SyncLog[];
}

export default function AdminSyncClient({
  status,
  recentLogs,
}: AdminSyncProps) {
  const [isSyncing, setIsSyncing] = useState<Record<string, boolean>>({});

  const handleTriggerSync = async (type: string) => {
    try {
      setIsSyncing((prev) => ({ ...prev, [type]: true }));
      const response = await apiClient.post(`/admin/sync/${type}`);

      if (response.status === 200) {
        alert(`Sinkronisasi ${type} telah dijadwalkan.`);
      } else {
        alert("Gagal memicu sinkronisasi.");
      }
    } catch (error) {
      console.error("Trigger sync error:", error);
      alert("Terjadi kesalahan saat sinkronisasi.");
    } finally {
      setIsSyncing((prev) => ({ ...prev, [type]: false }));
    }
  };

  const syncItems = [
    {
      key: "products",
      label: "Produk & Terjemahan",
      icon: Package,
      data: status?.products || {
        last_sync: new Date().toISOString(),
        status: "idle",
      },
    },
    {
      key: "stock",
      label: "Stok Persediaan",
      icon: Archive,
      data: status?.stock || {
        last_sync: new Date().toISOString(),
        status: "idle",
      },
    },
    {
      key: "categories",
      label: "Kategori & Struktur",
      icon: FolderTree,
      data: status?.categories || {
        last_sync: new Date().toISOString(),
        status: "idle",
      },
    },
    {
      key: "orders",
      label: "Status Pesanan (Pusher)",
      icon: Truck,
      data: status?.orders || {
        last_sync: new Date().toISOString(),
        status: "idle",
      },
    },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-50 to-blue-50 px-5 py-2.5 shadow-sm border border-sky-100/50 mb-4">
              <RefreshCw className="h-4 w-4 text-sky-600" />
              <span className="text-sm font-semibold text-sky-700">
                Sinkronisasi Odoo
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-sky-800 to-gray-900 bg-clip-text text-transparent font-heading">
              Odoo ERP Synchronization
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Pantau dan kendalikan pertukaran data antara Website dan Odoo
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="md" className="rounded-2xl">
              <Settings className="mr-2 h-4 w-4" />
              Konfigurasi Odoo
            </Button>
            <Button
              variant="gradient"
              size="md"
              className="shadow-lg hover:shadow-xl rounded-2xl"
              onClick={() => handleTriggerSync("all")}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Sinkronkan Semua
            </Button>
          </div>
        </div>
      </div>

      {/* Sync Status Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {syncItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.key}
              className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100">
                  <IconComponent className="h-6 w-6 text-sky-600" />
                </div>
                <Badge
                  variant={
                    item.data.status === "idle"
                      ? "success"
                      : item.data.status === "running"
                        ? "info"
                        : "error"
                  }
                >
                  {item.data.status.toUpperCase()}
                </Badge>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-gray-900">{item.label}</h4>
                <p className="text-xs text-gray-500">
                  Terakhir: {new Date(item.data.last_sync).toLocaleString()}
                </p>
              </div>
              <Button
                className="mt-6 w-full rounded-2xl"
                size="sm"
                variant="outline"
                onClick={() => handleTriggerSync(item.key)}
                isLoading={isSyncing[item.key]}
              >
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                Sync Sekarang
              </Button>
            </div>
          );
        })}
      </div>

      {/* Recent Logs Table */}
      <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100">
          <h3 className="text-xl font-bold text-gray-900">
            Riwayat Sinkronisasi Terakhir
          </h3>
          <Link
            href="/admin/sync/logs"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors"
          >
            Lihat Semua Log
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-6 py-3">Waktu</th>
                <th className="px-6 py-3">Entitas</th>
                <th className="px-6 py-3">Aksi</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Pesan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Array.isArray(recentLogs) &&
                recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {log.entity_type || log.sync_type}{" "}
                      {(log.entity_id || log.sync_direction) &&
                        `(#${log.entity_id || log.sync_direction})`}
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-600">
                      {log.action || log.sync_direction}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={log.status === "success" ? "success" : "error"}
                      >
                        {log.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">
                      {log.message ||
                        log.error_message ||
                        `${log.records_processed || 0} processed`}
                    </td>
                  </tr>
                ))}
              {(!recentLogs || recentLogs.length === 0) && (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <RefreshCw className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-base font-medium text-gray-500">
                      Belum ada riwayat sinkronisasi.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
