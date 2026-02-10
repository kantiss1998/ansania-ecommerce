import { VoucherForm } from '@/components/features/admin/vouchers/VoucherForm';
import { adminVoucherService } from '@/services/adminVoucherService';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function VoucherDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    const { id } = await params;
    const voucher = await adminVoucherService.getVoucher(parseInt(id), token);
    if (!voucher) notFound();

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Voucher: {voucher.code}</h1>
            <VoucherForm initialData={voucher} />
        </div>
    );
}
