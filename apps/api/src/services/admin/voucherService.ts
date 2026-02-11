
import { Voucher } from '@repo/database';
import { NotFoundError } from '@repo/shared/errors';
import { Op } from 'sequelize';

export async function listVouchers(query: any) {
    const { page = 1, limit = 10, search, status } = query;
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
        meta: {
            total: count,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(count / Number(limit))
        }
    };
}

export async function createVoucher(data: any) {
    return Voucher.create(data);
}

export async function updateVoucher(id: number, data: any) {
    const voucher = await Voucher.findByPk(id);
    if (!voucher) throw new NotFoundError('Voucher');

    await voucher.update(data);
    return voucher;
}

export async function deleteVoucher(id: number) {
    const voucher = await Voucher.findByPk(id);
    if (!voucher) throw new NotFoundError('Voucher');

    await voucher.destroy();
    return { success: true };
}

export async function getVoucherDetail(id: number) {
    const voucher = await Voucher.findByPk(id);
    if (!voucher) throw new NotFoundError('Voucher');
    return voucher;
}

export async function toggleVoucherActive(id: number) {
    const voucher = await Voucher.findByPk(id);
    if (!voucher) throw new NotFoundError('Voucher');
    await voucher.update({ is_active: !voucher.is_active });
    return voucher;
}

export async function getVoucherStats(id: number) {
    const { VoucherUsage } = require('@repo/database');
    const usageCount = await VoucherUsage.count({ where: { voucher_id: id } });
    return { usageCount };
}

export async function getVoucherUsageHistory(id: number, query: any) {
    const { VoucherUsage, Order, User } = require('@repo/database');
    const { page = 1, limit = 20 } = query;
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

    return { items: rows, meta: { total: count, page, limit } };
}

export async function bulkDeleteVouchers(ids: number[]) {
    await Voucher.destroy({ where: { id: { [Op.in]: ids } } });
    return { success: true };
}
