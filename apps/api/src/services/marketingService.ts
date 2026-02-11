
import { Cart, CartItem, User, Product } from '@repo/database';
import { Op } from 'sequelize';

import { queueEmail } from './emailService';

/**
 * Process abandoned carts and send reminder emails
 * Criteria: Cart updated more than 24 hours ago but less than 48 hours ago
 */
export async function processAbandonedCarts() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const abandonedCarts = await Cart.findAll({
        where: {
            updated_at: {
                [Op.between]: [twoDaysAgo, oneDayAgo]
            },
            total: { [Op.gt]: 0 }
        },
        include: [
            { model: User, as: 'user' },
            {
                model: CartItem,
                as: 'items',
                include: [{ model: Product, as: 'product' }]
            }
        ]
    });

    let sentCount = 0;
    for (const cart of abandonedCarts) {
        if (!cart.user || !cart.user.email) continue;

        const itemsList = (cart.items || [])
            .map(item => `- ${item.product?.name || 'Product'} (x${item.quantity})`)
            .join('\n');

        await queueEmail(
            cart.user.email,
            'Don\'t forget your items!',
            `Hi ${cart.user.full_name || 'there'},\n\nYou left some items in your cart. Come back and complete your purchase!\n\nItems:\n${itemsList}\n\nBest regards,\nAnsania Team`,
            'abandoned_cart',
            cart.id
        );
        sentCount++;
    }

    return { success: true, count: sentCount };
}

/**
 * Send promotional offers to inactive users
 */
export async function sendPromotionalOffers() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 60 * 60 * 1000 * 24);

    const inactiveUsers = await User.findAll({
        where: {
            role: 'customer',
            updated_at: { [Op.lt]: thirtyDaysAgo }
        }
    });

    let sentCount = 0;
    for (const user of inactiveUsers) {
        await queueEmail(
            user.email,
            'We miss you! Here is a 10% discount',
            `Hi ${user.full_name || 'there'},\n\nIt's been a while! Use code MISSYOU10 for 10% off your next order.\n\nBest regards,\nAnsania Team`,
            'promotion',
            user.id
        );
        sentCount++;
    }

    return { success: true, count: sentCount };
}
