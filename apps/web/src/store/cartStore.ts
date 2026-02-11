import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getErrorMessage } from '@/lib/api';
import { cartService, Cart } from '@/services/cartService';

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

                    set({
                        cart,
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
                        cart,
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
                        cart,
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
                        cart,
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
                        cart,
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
                        cart,
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
