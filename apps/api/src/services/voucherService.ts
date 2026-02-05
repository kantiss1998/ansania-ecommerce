
import { Voucher, Cart, CartItem } from '@repo/database';
import { AppError, NotFoundError } from '@repo/shared/errors';
import { Op } from 'sequelize';

export async function validateVoucher(code: string, cartTotal: number) {
    // @ts-ignore
    const voucher = await Voucher.findOne({
        where: {
            code,
            is_active: true,
            start_date: { [Op.lte]: new Date() },
            end_date: { [Op.gte]: new Date() }
        }
    });

    if (!voucher) {
        throw new NotFoundError('Voucher validation failed: Invalid or expired code');
    }

    if (!voucher.isValid(cartTotal)) {
        throw new AppError('Voucher conditions not met (min purchase or usage limit)', 400);
    }

    return voucher;
}

export async function applyVoucher(cartId: number, code: string) {
    // @ts-ignore
    const cart = await Cart.findByPk(cartId, {
        include: [{ model: CartItem, as: 'items' }] // Need items for total calculation just in case
    });

    if (!cart) throw new NotFoundError('Cart');

    // Remove existing voucher first? Or easy replace.

    // Calculate current subtotal from items if not trusting cart.subtotal
    // Assuming cart.subtotal is up to date (cartService updates it on item change)
    const subtotal = Number(cart.subtotal);

    const voucher = await validateVoucher(code, subtotal);

    // Calculate discount
    const discountAmount = voucher.calculateDiscount(subtotal);

    // Update Cart
    await cart.update({
        voucher_id: voucher.id,
        discount_amount: discountAmount,
        total: Math.max(0, subtotal - discountAmount)
    });

    return cart; // Or return voucher details?
}

export async function removeVoucher(cartId: number) {
    // @ts-ignore
    const cart = await Cart.findByPk(cartId);
    if (!cart) throw new NotFoundError('Cart');

    await cart.update({
        voucher_id: null,
        discount_amount: 0,
        total: cart.subtotal // Reset total to subtotal
    });

    return cart;
}
