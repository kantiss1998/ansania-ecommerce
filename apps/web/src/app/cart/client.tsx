'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { CartItem as CartItemComponent } from '@/components/features/cart/CartItem';
import { CartSummary } from '@/components/features/cart/CartSummary';
import { VoucherInput } from '@/components/features/cart/VoucherInput';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';

function CartContent() {
    const router = useRouter();
    const {
        cart,
        fetchCart,
        updateItemQuantity,
        removeItem,
        applyVoucher,
        removeVoucher,
        isLoading,
    } = useCartStore();
    const { success, error } = useToast();

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleUpdateQuantity = async (itemId: number, quantity: number) => {
        try {
            await updateItemQuantity(itemId, quantity);
            success('Jumlah item berhasil diperbarui');
        } catch (err) {
            error('Gagal memperbarui jumlah item');
        }
    };

    const handleRemoveItem = async (itemId: number) => {
        try {
            await removeItem(itemId);
            success('Item berhasil dihapus dari keranjang');
        } catch (err) {
            error('Gagal menghapus item');
        }
    };

    const handleApplyVoucher = async (code: string) => {
        try {
            await applyVoucher(code);
            success(`Voucher ${code} berhasil diterapkan!`);
        } catch (err) {
            error('Kode voucher tidak valid atau sudah kadaluarsa');
        }
    };

    const handleRemoveVoucher = async () => {
        try {
            await removeVoucher();
            success('Voucher berhasil dihapus');
        } catch (err) {
            error('Gagal menghapus voucher');
        }
    };

    // Map store cart items to component props
    const cartItems = cart?.items.map((item) => ({
        id: item.id,
        product_variant_id: item.variant.id,
        product_name: item.product.name,
        product_slug: item.product.slug,
        variant_info: [item.variant.color, item.variant.size, item.variant.finishing].filter(Boolean).join(', '),
        product_image: item.product.image || '/placeholder-product.svg',
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
        stock: item.stock_available,
    })) || [];

    const summary = {
        subtotal: cart?.subtotal || 0,
        discount: cart?.discount_amount || 0,
        shipping: 0, // Calculated at checkout
        total: cart?.total || 0,
        voucher_code: cart?.voucher?.code,
    };

    if (isLoading && !cart) {
        return <div className="container mx-auto p-12 text-center text-gray-500">Memuat keranjang...</div>;
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
                    <div className="mb-6 rounded-full bg-white p-6 shadow-sm">
                        <svg
                            className="h-16 w-16 text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Keranjang Belanja Kosong
                    </h2>
                    <p className="mt-2 text-gray-600 max-w-md">
                        Wah, keranjangmu masih kosong nih. Yuk, cari furnitur impianmu di katalog kami!
                    </p>
                    <Button
                        onClick={() => router.push('/products')}
                        variant="primary"
                        size="lg"
                        className="mt-8"
                    >
                        Mulai Belanja
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-gray-900">
                    Keranjang Belanja
                </h1>
                <p className="mt-2 text-gray-600">
                    Anda memiliki <span className="font-semibold text-primary-700">{cart.items.length} item</span> di dalam keranjang
                </p>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        {cartItems.map((item) => (
                            <CartItemComponent
                                key={item.id}
                                item={item}
                                onUpdateQuantity={handleUpdateQuantity}
                                onRemove={handleRemoveItem}
                                isUpdating={isLoading}
                            />
                        ))}
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 font-semibold text-gray-900">Kode Voucher / Promo</h3>
                        <VoucherInput
                            onApply={handleApplyVoucher}
                            onRemove={handleRemoveVoucher}
                            appliedCode={summary.voucher_code}
                            isLoading={isLoading}
                        />
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <CartSummary
                            summary={summary}
                            onCheckout={() => router.push('/checkout')}
                            isCheckoutDisabled={cartItems.length === 0}
                        />

                        <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm text-blue-700 border border-blue-100">
                            <div className="flex gap-3">
                                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p>Ongkos kirim akan dihitung pada langkah selanjutnya (Checkout).</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CartClient() {
    return (
        <Suspense fallback={<div className="container mx-auto p-12 text-center text-gray-400">Memuat keranjang...</div>}>
            <CartContent />
        </Suspense>
    );
}
