
import { Cart, CartItem, ProductVariant, Product, ProductImage } from '@repo/database';
import { AppError, NotFoundError, InsufficientStockError } from '@repo/shared/errors';
import { AddToCartDTO } from '@repo/shared/schemas';
import { WhereOptions } from 'sequelize';

// Helper to get cart with items
async function getCartWithItems(whereClause: WhereOptions) {
    return Cart.findOne({
        where: whereClause,
        include: [
            {
                model: CartItem,
                as: 'items',
                include: [
                    {
                        model: ProductVariant,
                        as: 'productVariant',
                        include: [
                            { model: Product, as: 'product', include: [{ model: ProductImage, as: 'images' }] }
                        ]
                    }
                ]
            }
        ],
        order: [[{ model: CartItem, as: 'items' }, 'created_at', 'DESC']]
    });
}

export async function getCart(userId?: number, sessionId?: string) {
    if (!userId && !sessionId) {
        throw new AppError('User ID or Session ID required', 400);
    }

    const where: WhereOptions = {};
    if (userId) (where as any).user_id = userId;
    else (where as any).session_id = sessionId;

    let cart = await getCartWithItems(where);

    if (!cart) {
        // Create new cart if access only
        // But usually we create on 'add', but getCart might be called to view empty cart.
        // Let's return null or empty structure? 
        // For API, returning null might be fine, or create empty.
        // Let's create one compliant with schema.
        cart = await Cart.create({
            user_id: userId || null,
            session_id: !userId ? sessionId : null,
            subtotal: 0,
            total: 0,
            discount_amount: 0,
            expires_at: !userId ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null // 7 days for guest
        });

        // Reload with includes
        cart = await getCartWithItems({ id: cart.id });
    }

    // Calculate totals locally to ensure accuracy (or trust DB if we maintain it well)
    // Good practice to recalc on fetch
    let subtotal = 0;
    const items = cart?.items || [];
    for (const item of items) {
        const variant = item.productVariant;
        if (variant) {
            // Update price if changed?
            // For now use stored price or current? Usually current price unless locked.
            // Let's use current price from variant
            subtotal += Number(variant.price) * item.quantity;
        }
    }

    // Update cart if needed (skip for now to avoid side effects on GET, handling in actions usually)

    return cart;
}

export async function addToCart(
    userId: number | undefined,
    sessionId: string | undefined,
    data: AddToCartDTO
) {
    const cart = await getCart(userId, sessionId);
    if (!cart) throw new AppError('Could not initialize cart', 500);

    const variant = await ProductVariant.findByPk(data.product_variant_id);
    if (!variant) throw new NotFoundError('Product Variant');

    // Check Stock
    if (variant.stock < data.quantity) {
        throw new InsufficientStockError(variant.sku); // Using SKU or Name
    }

    // Check if item exists in cart
    const item = await CartItem.findOne({
        where: {
            cart_id: cart.id,
            product_variant_id: data.product_variant_id
        }
    });

    if (item) {
        // Update quantity
        const newQty = item.quantity + data.quantity;
        if (variant.stock < newQty) throw new InsufficientStockError(variant.sku);

        await item.update({
            quantity: newQty,
            subtotal: Number(variant.price) * newQty
        });
    } else {
        // Create new item
        await CartItem.create({
            cart_id: cart.id,
            product_variant_id: variant.id,
            quantity: data.quantity,
            price: variant.price,
            subtotal: Number(variant.price) * data.quantity
        });
    }

    // Update Cart Totals
    await updateCartTotals(cart.id);

    return getCart(userId, sessionId);
}

export async function updateItem(
    userId: number | undefined,
    sessionId: string | undefined,
    itemId: number,
    quantity: number
) {
    const cart = await getCart(userId, sessionId);
    if (!cart) throw new AppError('Cart not found', 404);

    const item = await CartItem.findOne({
        where: { id: itemId, cart_id: cart.id },
        include: [{ model: ProductVariant, as: 'productVariant' }]
    });

    if (!item) throw new NotFoundError('Cart Item');

    if (quantity <= 0) {
        await item.destroy();
    } else {
        if (item.productVariant && item.productVariant.stock < quantity) {
            throw new InsufficientStockError(item.productVariant.sku);
        }
        await item.update({
            quantity,
            subtotal: Number(item.productVariant!.price) * quantity
        });
    }

    await updateCartTotals(cart.id);
    return getCart(userId, sessionId);
}

export async function removeItem(
    userId: number | undefined,
    sessionId: string | undefined,
    itemId: number
) {
    const cart = await getCart(userId, sessionId);
    if (!cart) throw new AppError('Cart not found', 404);

    const item = await CartItem.findOne({ where: { id: itemId, cart_id: cart.id } });
    if (!item) throw new NotFoundError('Cart Item');

    await item.destroy();
    await updateCartTotals(cart.id);

    return getCart(userId, sessionId);
}

async function updateCartTotals(cartId: number) {
    const items = await CartItem.findAll({ where: { cart_id: cartId } });
    let subtotal = 0;

    for (const item of items) {
        subtotal += Number(item.subtotal);
    }

    // Logic for discount application would go here if we had voucher info stored on Cart
    // For now assuming 0 discount or implementing voucher service later

    await Cart.update(
        {
            subtotal,
            total: subtotal // - discount
        },
        { where: { id: cartId } }
    );
}

export async function clearCart(
    userId: number | undefined,
    sessionId: string | undefined
) {
    const cart = await getCart(userId, sessionId);
    if (!cart) throw new AppError('Cart not found', 404);

    // Delete all items in the cart
    await CartItem.destroy({
        where: { cart_id: cart.id }
    });

    // Update cart totals to zero
    await Cart.update(
        {
            subtotal: 0,
            total: 0,
            discount_amount: 0
        },
        { where: { id: cart.id } }
    );

    return getCart(userId, sessionId);
}

export async function mergeGuestCartToUser(
    userId: number,
    sessionId: string
) {
    // Find guest cart
    const guestCart = await Cart.findOne({
        where: { session_id: sessionId },
        include: [{
            model: CartItem,
            as: 'items',
            include: [{
                model: ProductVariant,
                as: 'productVariant'
            }]
        }]
    });

    if (!guestCart || !guestCart.items || guestCart.items.length === 0) {
        // No guest cart or empty, just return user's cart
        return getCart(userId, undefined);
    }

    // Get or create user cart
    let userCart = await Cart.findOne({
        where: { user_id: userId }
    });

    if (!userCart) {
        userCart = await Cart.create({
            user_id: userId,
            session_id: null,
            subtotal: 0,
            total: 0,
            discount_amount: 0
        });
    }

    // Merge items from guest cart to user cart
    for (const guestItem of guestCart.items) {
        // Check if item already exists in user cart
        const existingItem = await CartItem.findOne({
            where: {
                cart_id: userCart.id,
                product_variant_id: guestItem.product_variant_id
            }
        });

        if (existingItem) {
            // Update quantity (combine)
            const newQuantity = existingItem.quantity + guestItem.quantity;
            const variant = guestItem.productVariant;
            
            // Check stock before merging
            if (variant && variant.stock >= newQuantity) {
                await existingItem.update({
                    quantity: newQuantity,
                    subtotal: Number(variant.price) * newQuantity
                });
            }
            // If stock insufficient, keep existing quantity (don't merge)
        } else {
            // Add new item to user cart
            await CartItem.create({
                cart_id: userCart.id,
                product_variant_id: guestItem.product_variant_id,
                quantity: guestItem.quantity,
                price: guestItem.price,
                subtotal: guestItem.subtotal
            });
        }
    }

    // Delete guest cart
    await CartItem.destroy({ where: { cart_id: guestCart.id } });
    await guestCart.destroy();

    // Update user cart totals
    await updateCartTotals(userCart.id);

    return getCart(userId, undefined);
}
