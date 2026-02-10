import { flashSaleService } from '@/services/flashSaleService';
import AdminFlashSalesClient from './client';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function AdminFlashSalesPage({ searchParams }: { searchParams: Promise<{ page?: string, status?: string }> }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    const resolvedParams = await searchParams;
    const page = Number(resolvedParams.page) || 1;
    const status = resolvedParams.status as any || 'all';

    const data = await flashSaleService.getAllFlashSales({ page, limit: 10, status }, token);

    return <AdminFlashSalesClient initialData={data} />;
}
