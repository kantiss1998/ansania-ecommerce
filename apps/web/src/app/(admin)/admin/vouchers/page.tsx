import { cookies } from 'next/headers';

import { adminVoucherService } from '@/services/adminVoucherService';

import AdminVouchersClient from './client';

export const dynamic = 'force-dynamic';

export default async function AdminVouchersPage({ searchParams }: { searchParams: Promise<{ page?: string, status?: string }> }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    const resolvedParams = await searchParams;
    const page = Number(resolvedParams.page) || 1;
    const status = resolvedParams.status as any || 'all';

    const data = await adminVoucherService.getAllVouchers({ page, limit: 10, status }, token);

    return <AdminVouchersClient initialData={data} />;
}
