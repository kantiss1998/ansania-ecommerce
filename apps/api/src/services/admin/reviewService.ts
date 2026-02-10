
import { Review, User, Product } from '@repo/database';
import { Op } from 'sequelize';
import { NotFoundError } from '@repo/shared/errors';

export async function listAllReviews(query: any) {
    const {
        page = 1,
        limit = 10,
        status,
        rating,
        search
    } = query;

    const offset = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (status === 'approved') where.is_approved = true;
    if (status === 'pending') where.is_approved = false;
    if (rating) where.rating = rating;

    if (search) {
        where[Op.or] = [
            { comment: { [Op.like]: `%${search}%` } },
            { '$user.full_name$': { [Op.like]: `%${search}%` } },
            { '$product.name$': { [Op.like]: `%${search}%` } }
        ];
    }

    const { count, rows } = await Review.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']],
        include: [
            { model: User, as: 'user', attributes: ['full_name', 'email'] },
            { model: Product, as: 'product', attributes: ['name', 'slug'] }
        ],
        distinct: true
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

export async function moderateReview(id: number, approved: boolean) {
    const review = await Review.findByPk(id);
    if (!review) throw new NotFoundError('Review');

    await review.update({ is_approved: approved });
    return review;
}

export async function deleteReview(id: number) {
    const review = await Review.findByPk(id);
    if (!review) throw new NotFoundError('Review');

    await review.destroy();
    return { success: true };
}

export async function bulkApprove(ids: number[]) {
    await Review.update({ is_approved: true }, {
        where: { id: { [Op.in]: ids } }
    });
    return { success: true, count: ids.length };
}

export async function bulkReject(ids: number[]) {
    await Review.update({ is_approved: false }, {
        where: { id: { [Op.in]: ids } }
    });
    return { success: true, count: ids.length };
}

export async function getPendingReviews(query: any) {
    return listAllReviews({ ...query, status: 'pending' });
}
