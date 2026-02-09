import { adminVoucherService } from '@/services/adminVoucherService';
import AdminVouchersClient from './client';

export const dynamic = 'force-dynamic';

export default async function AdminVouchersPage({ searchParams }: { searchParams: Promise<{ page?: string, status?: string }> }) {
    const resolvedParams = await searchParams;
    const page = Number(resolvedParams.page) || 1;
    const status = resolvedParams.status as any || 'all';

    const data = await adminVoucherService.getAllVouchers({ page, limit: 10, status });

    return <AdminVouchersClient initialData={data} />;
}
