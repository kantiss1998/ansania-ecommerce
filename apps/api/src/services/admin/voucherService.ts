import { Voucher, VoucherUsage, Order, User } from '@repo/database';
import { NotFoundError } from '@repo/shared/errors';
import { Op } from 'sequelize';
import { PAGINATION } from '@repo/shared/constants';
import { calculatePagination } from '@repo/shared/utils';

export interface VoucherListResult {
    items: Voucher[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export async function listVouchers(query: {
    page?: number | string;
    limit?: number | string;
    search?: string;
    status?: string;
}): Promise<VoucherListResult> {
    const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, search, status } = query;
    const offset = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (search) {
        where[Op.or] = [
            { code: { [Op.like]: `%${search}%` } },
            { name: { [Op.like]: `%${search}%` } }
        ];
    }

    if (status === 'active') where.is_active = true;
    if (status === 'inactive') where.is_active = false;
    if (status === 'expired') where.end_date = { [Op.lt]: new Date() };

    const { count, rows } = await Voucher.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']]
    });

    return {
        items: rows,
        meta: calculatePagination(Number(page), Number(limit), count)
    };
}

export async function createVoucher(data: Partial<Voucher>): Promise<Voucher> {
    return Voucher.create(data as any);
}

export async function updateVoucher(id: number, data: Partial<Voucher>): Promise<Voucher> {
    const voucher = await Voucher.findByPk(id);
    if (!voucher) throw new NotFoundError('Voucher');

    await voucher.update(data);
    return voucher;
}

export async function deleteVoucher(id: number): Promise<{ success: boolean }> {
    const voucher = await Voucher.findByPk(id);
    if (!voucher) throw new NotFoundError('Voucher');

    await voucher.destroy();
    return { success: true };
}

export async function getVoucherDetail(id: number): Promise<Voucher> {
    const voucher = await Voucher.findByPk(id);
    if (!voucher) throw new NotFoundError('Voucher');
    return voucher;
}

export async function toggleVoucherActive(id: number): Promise<Voucher> {
    const voucher = await Voucher.findByPk(id);
    if (!voucher) throw new NotFoundError('Voucher');
    await voucher.update({ is_active: !voucher.is_active });
    return voucher;
}

export async function getVoucherStats(id: number): Promise<{ usageCount: number }> {
    const usageCount = await VoucherUsage.count({ where: { voucher_id: id } });
    return { usageCount };
}

export async function getVoucherUsageHistory(id: number, query: { page?: number | string; limit?: number | string }): Promise<{ items: VoucherUsage[]; meta: any }> {
    const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } = query;
    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await VoucherUsage.findAndCountAll({
        where: { voucher_id: id },
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']],
        include: [
            { model: Order, as: 'order', attributes: ['order_number', 'total_amount', 'status'] },
            { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] }
        ]
    });

    return { items: rows, meta: calculatePagination(Number(page), Number(limit), count) };
}

export async function bulkDeleteVouchers(ids: number[]): Promise<{ success: boolean }> {
    await Voucher.destroy({ where: { id: { [Op.in]: ids } } });
    return { success: true };
}
