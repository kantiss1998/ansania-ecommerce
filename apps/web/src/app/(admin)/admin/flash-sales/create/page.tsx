import { AdminFlashSaleForm } from '@/components/features/admin/flash-sales/AdminFlashSaleForm';

export default function CreateFlashSalePage() {
    return (
        <div className="mx-auto max-w-2xl px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Buat Flash Sale Baru</h1>
            <AdminFlashSaleForm />
        </div>
    );
}
