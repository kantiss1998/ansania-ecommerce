'use client';

import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { CartItem } from '@/components/features/cart/CartItem';
import { CartSummary } from '@/components/features/cart/CartSummary';
import { VoucherInput } from '@/components/features/cart/VoucherInput';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/ui/Toast';

function CartContent() {
    const router = useRouter();
    const {
        updateItemQuantity,
        removeItem,
        applyVoucher,
        removeVoucher,
        isLoading,
    } = useCartStore();
    const { success, error } = useToast();

    // Mock cart data - will be replaced with actual cart from store
    const mockCartItems = [
        {
            id: 1,
            product_variant_id: 1,
            product_name: 'Kursi Minimalis Modern',
            product_slug: 'kursi-minimalis-modern',
            variant_info: 'Putih, Medium, Glossy',
            product_image: '/placeholder-product.svg',
            price: 1200000,
            quantity: 2,
            subtotal: 2400000,
            stock: 10,
        },
        {
            id: 2,
            product_variant_id: 3,
            product_name: 'Meja Makan Kayu Jati',
            product_slug: 'meja-makan-kayu-jati',
            variant_info: 'Natural, Large',
            product_image: '/placeholder-product.svg',
            price: 3500000,
            quantity: 1,
            subtotal: 3500000,
            stock: 5,
        },
    ];

    const mockSummary = {
        subtotal: 5900000,
        discount: 590000,
        shipping: 0,
        total: 5310000,
        voucher_code: undefined,
    };

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

    const handleCheckout = () => {
        router.push('/checkout');
    };

    // Empty cart state
    if (mockCartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                    <svg
                        className="mb-4 h-20 w-20 text-gray-400"
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
                    <h2 className="text-2xl font-bold text-gray-900">
                        Keranjang Belanja Kosong
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Anda belum menambahkan produk ke keranjang
                    </p>
                    <button
                        onClick={() => router.push('/products')}
                        className="mt-6 rounded-lg bg-primary-700 px-6 py-3 text-sm font-medium text-white hover:bg-primary-800"
                    >
                        Mulai Belanja
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Keranjang Belanja
                </h1>
                <p className="mt-2 text-gray-600">
                    {mockCartItems.length} item dalam keranjang
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        {mockCartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onUpdateQuantity={handleUpdateQuantity}
                                onRemove={handleRemoveItem}
                                isUpdating={isLoading}
                            />
                        ))}
                    </div>

                    {/* Voucher Input */}
                    <div className="mt-6">
                        <VoucherInput
                            onApply={handleApplyVoucher}
                            onRemove={handleRemoveVoucher}
                            appliedCode={mockSummary.voucher_code}
                            isLoading={isLoading}
                        />
                    </div>
                </div>

                {/* Cart Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-20">
                        <CartSummary
                            summary={mockSummary}
                            onCheckout={handleCheckout}
                            isCheckoutDisabled={mockCartItems.length === 0}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CartClient() {
    return (
        <Suspense fallback={<div>Loading cart...</div>}>
            <CartContent />
        </Suspense>
    );
}
