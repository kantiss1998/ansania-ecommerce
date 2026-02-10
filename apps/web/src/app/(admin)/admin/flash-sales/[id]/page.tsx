import { AdminFlashSaleForm } from '@/components/features/admin/flash-sales/AdminFlashSaleForm';
import { flashSaleService } from '@/services/flashSaleService';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function FlashSaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    const { id } = await params;
    const flashSale = await flashSaleService.getFlashSale(parseInt(id), token);
    if (!flashSale) notFound();

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Flash Sale: {flashSale.name}</h1>
            <AdminFlashSaleForm initialData={flashSale} />
            {/* 
            TODO: Add component to manage products in this Flash Sale here. 
            However, user might want separate management view vs edit properties.
            For now, properties edit.
            */}
        </div>
    );
}
