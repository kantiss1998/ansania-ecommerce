
import { User, Order, Address, Review } from '@repo/database';
import { Op } from 'sequelize';
import { NotFoundError } from '@repo/shared/errors';

export async function listCustomers(query: any) {
    const {
        page = 1,
        limit = 10,
        search,
        status
    } = query;

    const offset = (Number(page) - 1) * Number(limit);
    const where: any = { role: 'customer' };

    if (search) {
        where[Op.or] = [
            { full_name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { phone: { [Op.like]: `%${search}%` } }
        ];
    }

    if (status) {
        // Assuming email_verified or some active flag
        if (status === 'active') where.email_verified = true;
        if (status === 'inactive') where.email_verified = false;
    }

    const { count, rows } = await User.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']],
        attributes: { exclude: ['password'] }
    });

    return {
        data: rows,
        meta: {
            total: count,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(count / Number(limit))
        }
    };
}

export async function getCustomerDetail(id: number) {
    const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [
            { model: Address, as: 'addresses' },
            { model: Order, as: 'orders', limit: 10, order: [['created_at', 'DESC']] },
            { model: Review, as: 'reviews', limit: 10, order: [['created_at', 'DESC']] }
        ]
    });

    if (!user) throw new NotFoundError('Customer');
    return user;
}

export async function updateCustomer(id: number, data: any) {
    const user = await User.findByPk(id);
    if (!user) throw new NotFoundError('Customer');

    await user.update(data);
    return user;
}

export async function toggleCustomerStatus(id: number) {
    const user = await User.findByPk(id);
    if (!user) throw new NotFoundError('Customer');

    // Toggle email_verified as a proxy for active status if no is_active field exists
    await user.update({ email_verified: !user.email_verified });
    return user;
}
