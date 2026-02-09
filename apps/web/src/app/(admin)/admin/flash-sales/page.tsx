import { flashSaleService } from '@/services/flashSaleService';
import AdminFlashSalesClient from './client';

export const dynamic = 'force-dynamic';

export default async function AdminFlashSalesPage({ searchParams }: { searchParams: Promise<{ page?: string, status?: string }> }) {
    const resolvedParams = await searchParams;
    const page = Number(resolvedParams.page) || 1;
    const status = resolvedParams.status as any || 'all';

    // flashSaleService.getAllFlashSales needs to be implemented/exposed properly
    const data = await flashSaleService.getAllFlashSales({ page, limit: 10, status });

    return <AdminFlashSalesClient initialData={data} />;
}
