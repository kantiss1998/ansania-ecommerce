import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getErrorMessage } from '@/lib/api';
import { cartService } from '@/services/cartService';

/**
 * Cart item interface
 */
interface CartItem {
    id: number;
    product: {
        id: number;
        name: string;
        slug: string;
        image: string;
    };
    variant: {
        id: number;
        sku: string;
        color?: string;
        finishing?: string;
        size?: string;
    };
    quantity: number;
    price: number;
    subtotal: number;
    stock_available: number;
}

/**
 * Voucher interface
 */
interface Voucher {
    code: string;
    discount_type: 'percentage' | 'fixed' | 'free_shipping';
    discount_value: number;
    discount_amount: number;
}

/**
 * Cart interface
 */
interface Cart {
    id?: number;
    items: CartItem[];
    subtotal: number;
    discount_amount: number;
    voucher: Voucher | null;
    total: number;
}

/**
 * Cart store state interface
 */
interface CartState {
    cart: Cart | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchCart: () => Promise<void>;
    addItem: (productVariantId: number, quantity: number) => Promise<void>;
    updateItemQuantity: (itemId: number, quantity: number) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    applyVoucher: (code: string) => Promise<void>;
    removeVoucher: () => Promise<void>;
    clearCart: () => void;
    getCartItemsCount: () => number;
    clearError: () => void;
}

/**
 * Cart store using Zustand with persistence
 */
export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: null,
            isLoading: false,
            error: null,

            fetchCart: async () => {
                set({ isLoading: true, error: null });

                try {
                    const cart = await cartService.getCart();

                    // Map service response to store Cart shape if needed
                    // For now assuming identical shape or compatible
                    // If cartService returns generic Cart structure, we might need mapping
                    // But typically backend response should match what we expect or we adapt types


                    set({
                        cart: cart as unknown as Cart,
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    const message = getErrorMessage(error);
                    set({
                        isLoading: false,
                        error: message,
                    });
                }
            },

            addItem: async (productVariantId: number, quantity: number) => {
                set({ isLoading: true, error: null });

                try {
                    const cart = await cartService.addToCart({ product_variant_id: productVariantId, quantity });

                    set({
                        cart: cart as unknown as Cart,
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    const message = getErrorMessage(error);
                    set({
                        isLoading: false,
                        error: message,
                    });
                    throw error;
                }
            },

            updateItemQuantity: async (itemId: number, quantity: number) => {
                set({ isLoading: true, error: null });

                try {
                    const cart = await cartService.updateItem(itemId, quantity);

                    set({
                        cart: cart as unknown as Cart,
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    const message = getErrorMessage(error);
                    set({
                        isLoading: false,
                        error: message,
                    });
                    throw error;
                }
            },

            removeItem: async (itemId: number) => {
                set({ isLoading: true, error: null });

                try {
                    const cart = await cartService.removeItem(itemId);

                    set({
                        cart: cart as unknown as Cart,
                        isLoading: false,
                        error: null
                    });
                } catch (error) {
                    const message = getErrorMessage(error);
                    set({
                        isLoading: false,
                        error: message,
                    });
                    throw error;
                }
            },

            applyVoucher: async (code: string) => {
                set({ isLoading: true, error: null });
                try {
                    const cart = await cartService.applyVoucher(code);
                    set({
                        cart: cart as unknown as Cart,
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    const message = getErrorMessage(error);
                    set({
                        isLoading: false,
                        error: message,
                    });
                }
            },

            removeVoucher: async () => {
                try {
                    const cart = await cartService.removeVoucher();
                    set({
                        cart: cart as unknown as Cart,
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    const message = getErrorMessage(error);
                    set({
                        isLoading: false,
                        error: message,
                    });
                }
            },

            clearCart: () => {
                set({ cart: null, error: null });
            },

            getCartItemsCount: () => {
                const { cart } = get();
                if (!cart || !cart.items) return 0;
                return cart.items.reduce((total, item) => total + item.quantity, 0);
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({
                cart: state.cart,
            }),
        }
    )
);
