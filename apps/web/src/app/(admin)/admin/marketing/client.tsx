"use client";

import {
  Megaphone,
  ShoppingCart,
  Send,
  Loader2,
  Lightbulb,
} from "lucide-react";
import { useState, Suspense } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getAccessToken } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";

// Define specific interfaces to avoid 'any'
interface MarketingStats {
  abandonedCarts: {
    count: number;
    total_value: number;
  };
  // Add other properties as needed
}

interface AdminMarketingClientProps {
  initialStats: MarketingStats | null;
}

function AdminMarketingContent({ initialStats }: AdminMarketingClientProps) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleMarketingAction = async (action: string) => {
    try {
      setIsProcessing(action);
      const token = getAccessToken();
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      ).replace(/\/$/, "");
      const response = await fetch(`${baseUrl}/admin/marketing/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || "Aksi marketing berhasil dijalankan.");
      } else {
        alert("Gagal menjalankan aksi marketing.");
      }
    } catch (error) {
      console.error("Marketing action error:", error);
      alert("Terjadi kesalahan.");
    } finally {
      setIsProcessing(null);
    }
  };

  const abandonedCarts = initialStats?.abandonedCarts || {
    count: 0,
    total_value: 0,
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-2.5 shadow-sm border border-blue-100/50 mb-4">
          <Megaphone className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-700">
            Marketing Tools
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent font-heading">
          Marketing & Promotion Tools
        </h2>
        <p className="mt-3 text-base text-gray-600">
          Otomasi campaign, recovery abandoned cart, dan pengiriman promosi
          massal
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Abandoned Cart Card */}
        <div className="rounded-3xl border-2 border-orange-200 bg-gradient-to-br from-white to-orange-50 p-8 shadow-xl transition-all hover:shadow-2xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-orange-100 border border-orange-200">
                  <ShoppingCart className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Abandoned Cart Recovery
                </h3>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Kirim pengingat otomatis ke pelanggan yang meninggalkan
                keranjang belanja
              </p>
            </div>
            <Badge variant="warning" className="text-lg px-3 py-1">
              {abandonedCarts.count}
            </Badge>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Potensi Revenue:</span>
              <span className="font-bold text-gray-900">
                {formatCurrency(abandonedCarts.total_value)}
              </span>
            </div>
            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
                style={{ width: "65%" }}
              />
            </div>
          </div>

          <div className="mt-8">
            <Button
              variant="primary"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-none shadow-lg rounded-2xl"
              onClick={() => handleMarketingAction("process-abandoned-carts")}
              isLoading={isProcessing === "process-abandoned-carts"}
            >
              <Send className="mr-2 h-4 w-4" />
              Proses & Kirim Reminder (Email)
            </Button>
            <p className="mt-2 text-xs text-center text-gray-500 font-medium">
              Sistem akan memvalidasi durasi abandonment sebelum mengirim email.
            </p>
          </div>
        </div>

        {/* Mass Promotions Card */}
        <div className="rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50 p-8 shadow-xl transition-all hover:shadow-2xl">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-blue-100 border border-blue-200">
              <Megaphone className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Broadcast Promosi
            </h3>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Kirim update produk terbaru atau diskon khusus ke seluruh basis
            pelanggan
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="h-3 w-3 rounded-full bg-gradient-to-r from-green-400 to-green-600" />
              <span>Target: 2,450 Pelanggan Terverifikasi</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600" />
              <span>Saluran: Email & Notifikasi Sistem</span>
            </div>
          </div>

          <div className="mt-12">
            <Button
              variant="gradient"
              className="w-full shadow-lg rounded-2xl"
              onClick={() => handleMarketingAction("send-promotions")}
              isLoading={isProcessing === "send-promotions"}
            >
              <Send className="mr-2 h-4 w-4" />
              Kirim Campaign Sekarang
            </Button>
            <p className="mt-2 text-xs text-center text-gray-500 font-medium italic">
              Pastikan template promosi sudah dikonfigurasi di CMS Settings.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb className="h-5 w-5 text-amber-600" />
          <h3 className="text-lg font-bold text-gray-900">
            Tips Marketing Efektif
          </h3>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2 p-4 rounded-2xl bg-white border border-blue-100">
            <h4 className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Waktu Pengiriman
            </h4>
            <p className="text-sm text-gray-600">
              Kirim email reminder abandoned cart rata-rata 1-3 jam setelah
              pelanggan meninggalkan situs.
            </p>
          </div>
          <div className="space-y-2 p-4 rounded-2xl bg-white border border-purple-100">
            <h4 className="text-xs font-bold uppercase tracking-widest text-purple-600">
              Personalisasi
            </h4>
            <p className="text-sm text-gray-600">
              Gunakan nama pelanggan dan sertakan gambar produk yang mereka
              tinggalkan di cart.
            </p>
          </div>
          <div className="space-y-2 p-4 rounded-2xl bg-white border border-green-100">
            <h4 className="text-xs font-bold uppercase tracking-widest text-green-600">
              Insentif
            </h4>
            <p className="text-sm text-gray-600">
              Tawarkan kode voucher diskon 5-10% khusus untuk mendorong
              penyelesaian transaksi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminMarketingClient({
  initialStats,
}: AdminMarketingClientProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-lg">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-spin" />
            <p className="text-base font-medium text-gray-600">
              Menyiapkan tools marketing...
            </p>
          </div>
        </div>
      }
    >
      <AdminMarketingContent initialStats={initialStats} />
    </Suspense>
  );
}
