'use client';

import { useRouter } from 'next/navigation';
import { ShoppingBasket, Info, Sparkles, ArrowRight } from 'lucide-react';
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
        return (
            <div className="container mx-auto p-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
                    <p className="text-gray-500 animate-pulse">Memuat keranjang...</p>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 animate-fade-in">
                <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 via-white to-primary-50/20 p-16 text-center shadow-inner">
                    <div className="mb-8 relative">
                        <div className="absolute inset-0 bg-primary-100 rounded-full blur-2xl opacity-30 animate-pulse-slow"></div>
                        <div className="relative rounded-full bg-white p-8 shadow-xl ring-1 ring-gray-100">
                            <ShoppingBasket className="h-20 w-20 text-primary-400" strokeWidth={1.5} />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        Keranjang Belanja Kosong
                    </h2>
                    <p className="text-gray-600 max-w-md mb-8 text-lg">
                        Wah, keranjangmu masih kosong nih. Yuk, cari furnitur impianmu di katalog kami!
                    </p>
                    <Button
                        onClick={() => router.push('/products')}
                        variant="gradient"
                        size="lg"
                        rightIcon={ArrowRight}
                        className="shadow-2xl"
                    >
                        <Sparkles className="h-5 w-5" />
                        Mulai Belanja
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in">
            {/* Header with gradient accent */}
            <div className="mb-10 relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-primary rounded-full blur-3xl opacity-20"></div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 relative">
                    Keranjang Belanja
                </h1>
                <p className="mt-3 text-gray-600 text-lg">
                    Anda memiliki <span className="font-bold text-gradient">{cart.items.length} item</span> di dalam keranjang
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Cart Items Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items Card */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="space-y-6">
                            {cartItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="animate-slide-up"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <CartItemComponent
                                        item={item}
                                        onUpdateQuantity={handleUpdateQuantity}
                                        onRemove={handleRemoveItem}
                                        isUpdating={isLoading}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Voucher Card */}
                    <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-primary-50/30 p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 bg-gradient-primary rounded-lg">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">Kode Voucher / Promo</h3>
                        </div>
                        <VoucherInput
                            onApply={handleApplyVoucher}
                            onRemove={handleRemoveVoucher}
                            appliedCode={summary.voucher_code}
                            isLoading={isLoading}
                        />
                    </div>
                </div>

                {/* Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <CartSummary
                            summary={summary}
                            onCheckout={() => router.push('/checkout')}
                            isCheckoutDisabled={cartItems.length === 0}
                        />

                        {/* Info Card */}
                        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 text-sm text-blue-800 border border-blue-200 shadow-md">
                            <div className="flex gap-3">
                                <Info className="h-5 w-5 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold mb-1">Informasi Pengiriman</p>
                                    <p className="text-blue-700">Ongkos kirim akan dihitung pada langkah selanjutnya (Checkout).</p>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="rounded-xl bg-white p-5 border border-gray-100 shadow-md">
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                    <span>Pembayaran Aman & Terpercaya</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                    <span>Gratis Retur 7 Hari</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                    <span>Garansi Produk Original</span>
                                </div>
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
        <Suspense fallback={
            <div className="container mx-auto p-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
                    <p className="text-gray-400 animate-pulse">Memuat keranjang...</p>
                </div>
            </div>
        }>
            <CartContent />
        </Suspense>
    );
}
