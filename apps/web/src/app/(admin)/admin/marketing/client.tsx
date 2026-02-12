'use client';

import { useState, Suspense } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getAccessToken } from '@/lib/auth';
import { formatCurrency } from '@/lib/utils';

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/marketing/${action}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || 'Aksi marketing berhasil dijalankan.');
      } else {
        alert('Gagal menjalankan aksi marketing.');
      }
    } catch (error) {
      console.error('Marketing action error:', error);
      alert('Terjadi kesalahan.');
    } finally {
      setIsProcessing(null);
    }
  };

  const abandonedCarts = initialStats?.abandonedCarts || { count: 0, total_value: 0 };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Marketing & Promotion Tools</h2>
          <p className="mt-1 text-sm text-gray-600">
            Otomasi campaign, recovery abandoned cart, dan pengiriman promosi massal
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Abandoned Cart Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md border-l-4 border-l-warning-500">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Abandoned Cart Recovery</h3>
              <p className="mt-1 text-sm text-gray-500">Kirim pengingat otomatis ke pelanggan yang meninggalkan keranjang belanja</p>
            </div>
            <Badge variant="warning" className="text-lg px-3 py-1">{abandonedCarts.count}</Badge>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Potensi Revenue:</span>
              <span className="font-bold text-gray-900">{formatCurrency(abandonedCarts.total_value)}</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-warning-500" style={{ width: '65%' }} />
            </div>
          </div>

          <div className="mt-8">
            <Button
              variant="primary"
              className="w-full bg-warning-600 hover:bg-warning-700 border-none"
              onClick={() => handleMarketingAction('process-abandoned-carts')}
              isLoading={isProcessing === 'process-abandoned-carts'}
            >
              Proses & Kirim Reminder (Email)
            </Button>
            <p className="mt-2 text-[10px] text-center text-gray-400 font-medium">Sistem akan memvalidasi durasi abandonment sebelum mengirim email.</p>
          </div>
        </div>

        {/* Mass Promotions Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md border-l-4 border-l-primary-500">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Broadcast Promosi</h3>
            <p className="mt-1 text-sm text-gray-500">Kirim update produk terbaru atau diskon khusus ke seluruh basis pelanggan</p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Target: 2,450 Pelanggan Terverifikasi</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="h-2 w-2 rounded-full bg-primary-500" />
              <span>Saluran: Email & Notifikasi Sistem</span>
            </div>
          </div>

          <div className="mt-12">
            <Button
              variant="primary"
              className="w-full shadow-lg shadow-primary-100"
              onClick={() => handleMarketingAction('send-promotions')}
              isLoading={isProcessing === 'send-promotions'}
            >
              Kirim Campaign Sekarang
            </Button>
            <p className="mt-2 text-[10px] text-center text-gray-400 font-medium italic">Pastikan template promosi sudah dikonfigurasi di CMS Settings.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm border-t-4 border-t-secondary-500">
        <h3 className="font-semibold text-gray-900 mb-4">Tips Marketing Efektif</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary-600">Waktu Pengiriman</h4>
            <p className="text-sm text-gray-600">Kirim email reminder abandoned cart rata-rata 1-3 jam setelah pelanggan meninggalkan situs.</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-secondary-600">Personalisasi</h4>
            <p className="text-sm text-gray-600">Gunakan nama pelanggan dan sertakan gambar produk yang mereka tinggalkan di cart.</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-success-600">Insentif</h4>
            <p className="text-sm text-gray-600">Tawarkan kode voucher diskon 5-10% khusus untuk mendorong penyelesaian transaksi.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminMarketingClient({ initialStats }: AdminMarketingClientProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Menyiapkan tools marketing...</div>}>
      <AdminMarketingContent initialStats={initialStats} />
    </Suspense>
  );
}
