'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, CreditCard, CheckCircle, ShoppingBag, Sparkles } from 'lucide-react';
import { AddressForm } from '@/components/features/checkout/AddressForm';
import { AddressSelector } from '@/components/features/checkout/AddressSelector';
import { PaymentMethodSelector, PaymentMethod } from '@/components/features/checkout/PaymentMethodSelector';
import { OrderReview, OrderSummaryData } from '@/components/features/checkout/OrderReview';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { addressService, Address } from '@/services/addressService';
import { checkoutService } from '@/services/checkoutService';
import { useCartStore } from '@/store/cartStore';
import { getErrorMessage } from '@/lib/api';
import { motion } from 'framer-motion';

function CheckoutContent() {
    const router = useRouter();
    const { success, error } = useToast();
    const { cart, isLoading: isCartLoading } = useCartStore();

    const [currentStep, setCurrentStep] = useState(1);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [shippingCost, setShippingCost] = useState(0);

    // Fetch addresses on mount
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const data = await addressService.getAddresses();
                setAddresses(data);
                // Auto-select default address
                const defaultAddress = data.find(a => a.is_default);
                if (defaultAddress) setSelectedAddress(defaultAddress);
            } catch (err) {
                console.error('Failed to fetch addresses', err);
            }
        };
        fetchAddresses();
    }, []);

    // Fetch shipping rates when address changes (simplified for now to fixed cost or mock calc)
    // Real implementation would call checkoutService.getShippingRates(selectedAddress.id)
    useEffect(() => {
        const calculateShipping = async () => {
            if (selectedAddress) {
                try {
                    // Try to fetch real rates
                    const rates = await checkoutService.getShippingRates(selectedAddress.id);
                    if (rates && rates.length > 0) {
                        setShippingCost(rates[0].cost); // Default to first rate
                    } else {
                        setShippingCost(15000); // Fallback
                    }
                } catch (err) {
                    console.warn('Failed to fetch shipping rates, using default', err);
                    setShippingCost(15000); // Fallback
                }
            }
        };
        calculateShipping();
    }, [selectedAddress]);

    // Mock payment methods (since no API endpoint yet)
    const mockPaymentMethods: PaymentMethod[] = [
        {
            id: 'bca',
            name: 'BCA Virtual Account',
            type: 'bank_transfer',
            description: 'Transfer melalui BCA Virtual Account',
            fee: 0,
        },
        {
            id: 'mandiri',
            name: 'Mandiri Virtual Account',
            type: 'bank_transfer',
            description: 'Transfer melalui Mandiri Virtual Account',
            fee: 0,
        },
        {
            id: 'gopay',
            name: 'GoPay',
            type: 'e_wallet',
            description: 'Bayar dengan GoPay',
            fee: 0,
        },
        {
            id: 'ovo',
            name: 'OVO',
            type: 'e_wallet',
            description: 'Bayar dengan OVO',
            fee: 0,
        },
        {
            id: 'credit_card',
            name: 'Kartu Kredit',
            type: 'credit_card',
            description: 'Visa, Mastercard, JCB',
            fee: 5000,
        },
        {
            id: 'cod',
            name: 'Cash on Delivery',
            type: 'cod',
            description: 'Bayar saat barang diterima',
            fee: 10000,
        },
    ];

    const orderSummary: OrderSummaryData = {
        items: cart?.items.map(item => ({
            product_name: item.product.name,
            variant_info: `${item.variant.color || ''} ${item.variant.size || ''}`,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal
        })) || [],
        subtotal: cart?.subtotal || 0,
        shipping_cost: shippingCost,
        payment_fee: selectedPayment?.fee || 0,
        discount: cart?.discount_amount || 0,
        total: (cart?.subtotal || 0) + shippingCost + (selectedPayment?.fee || 0) - (cart?.discount_amount || 0),
    };

    const handleAddressSubmit = async (formData: any) => {
        try {
            const newAddress = await addressService.createAddress(formData);
            setAddresses([...addresses, newAddress]);
            setSelectedAddress(newAddress);
            setIsAddressModalOpen(false);
            success('Alamat berhasil disimpan');
        } catch (err) {
            error(getErrorMessage(err));
        }
    };

    const handleNextStep = () => {
        if (currentStep === 1 && !selectedAddress) {
            error('Pilih alamat pengiriman terlebih dahulu');
            return;
        }
        if (currentStep === 2 && !selectedPayment) {
            error('Pilih metode pembayaran terlebih dahulu');
            return;
        }
        setCurrentStep((prev) => prev + 1);
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress || !selectedPayment) return;

        setIsProcessing(true);
        try {
            // Map payment method to API expectations
            // This maps 'bca' -> 'bank_transfer' provider? Or 'doku'?
            // Assuming simplified 'doku' provider for now based on paymentController
            const order = await checkoutService.createOrder({
                shipping_address_id: selectedAddress.id,
                payment_method: selectedPayment.id, // e.g., 'bca'
                payment_provider: 'doku', // Defaulting to doku
                items: cart?.items.map(i => ({ product_variant_id: i.variant.id, quantity: i.quantity })),
            });

            success('Pesanan berhasil dibuat!');
            router.push(`/orders/confirmation/${order.order_number}`); // Use real order number
        } catch (err) {
            error(getErrorMessage(err));
            setIsProcessing(false);
        }
    };

    const steps = [
        { number: 1, title: 'Alamat Pengiriman', icon: MapPin, color: 'from-blue-500 to-cyan-500' },
        { number: 2, title: 'Metode Pembayaran', icon: CreditCard, color: 'from-purple-500 to-pink-500' },
        { number: 3, title: 'Review Pesanan', icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
    ];

    if (!cart && !isCartLoading) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="mx-auto max-w-md">
                    <div className="mb-6 flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
                            <ShoppingBag className="h-10 w-10 text-gray-400" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Keranjang Kosong</h1>
                    <p className="text-gray-600 mb-6">Belum ada produk di keranjang Anda</p>
                    <Button
                        onClick={() => router.push('/products')}
                        variant="gradient"
                        size="lg"
                    >
                        Belanja Sekarang
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-purple-50 rounded-full px-4 py-2 mb-4">
                        <Sparkles className="h-4 w-4 text-primary-600" />
                        <span className="text-sm font-semibold text-primary-700">Proses Checkout</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent font-heading">
                        Checkout
                    </h1>
                    <p className="mt-2 text-gray-600">Lengkapi informasi untuk menyelesaikan pesanan Anda</p>
                </div>

                {/* Enhanced Stepper */}
                <div className="mb-12">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex flex-1 items-center">
                                <motion.div
                                    className="flex items-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="relative">
                                        {/* Glow effect */}
                                        {currentStep >= step.number && (
                                            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${step.color} blur-lg opacity-30`} />
                                        )}
                                        <div
                                            className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 font-semibold transition-all duration-300 ${currentStep >= step.number
                                                ? `border-transparent bg-gradient-to-r ${step.color} text-white shadow-lg`
                                                : 'border-gray-300 bg-white text-gray-400'
                                                }`}
                                        >
                                            <step.icon className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <span
                                        className={`ml-3 hidden font-semibold md:block ${currentStep >= step.number
                                            ? 'text-gray-900'
                                            : 'text-gray-400'
                                            }`}
                                    >
                                        {step.title}
                                    </span>
                                </motion.div>
                                {index < steps.length - 1 && (
                                    <div className="mx-4 h-1 flex-1 rounded-full overflow-hidden bg-gray-200">
                                        <motion.div
                                            className={`h-full bg-gradient-to-r ${step.color}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: currentStep > step.number ? '100%' : '0%' }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2"
                    >
                        <div className="rounded-2xl border-2 border-gray-100 bg-white p-8 shadow-lg">
                            {/* Step 1: Address */}
                            {currentStep === 1 && (
                                <AddressSelector
                                    addresses={addresses}
                                    selectedId={selectedAddress?.id}
                                    onSelect={setSelectedAddress}
                                    onAddNew={() => setIsAddressModalOpen(true)}
                                    onEdit={() => setIsAddressModalOpen(true)}
                                />
                            )}

                            {/* Step 2: Payment */}
                            {currentStep === 2 && (
                                <PaymentMethodSelector
                                    methods={mockPaymentMethods}
                                    selectedId={selectedPayment?.id}
                                    onSelect={setSelectedPayment}
                                />
                            )}

                            {/* Step 3: Review */}
                            {currentStep === 3 && selectedAddress && selectedPayment && (
                                <OrderReview
                                    address={selectedAddress}
                                    paymentMethod={selectedPayment}
                                    summary={orderSummary}
                                />
                            )}
                        </div>

                        {/* Enhanced Navigation Buttons */}
                        <div className="mt-6 flex gap-3">
                            {currentStep > 1 && (
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => setCurrentStep((prev) => prev - 1)}
                                    disabled={isProcessing}
                                    className="border-2"
                                >
                                    Kembali
                                </Button>
                            )}
                            {currentStep < 3 ? (
                                <Button
                                    variant="gradient"
                                    size="lg"
                                    onClick={handleNextStep}
                                    className="flex-1 shadow-lg"
                                >
                                    Lanjutkan
                                </Button>
                            ) : (
                                <Button
                                    variant="gradient"
                                    size="lg"
                                    onClick={handlePlaceOrder}
                                    isLoading={isProcessing}
                                    className="flex-1 shadow-lg"
                                >
                                    Buat Pesanan
                                </Button>
                            )}
                        </div>
                    </motion.div>

                    {/* Enhanced Order Summary Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-1"
                    >
                        <div className="sticky top-20 rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-lg">
                            <div className="flex items-center gap-2 mb-4">
                                <ShoppingBag className="h-5 w-5 text-primary-600" />
                                <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Ringkasan Pesanan
                                </h3>
                            </div>
                            <div className="space-y-3 border-b-2 border-gray-100 pb-4">
                                {orderSummary.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between text-sm"
                                    >
                                        <span className="text-gray-600">
                                            {item.product_name} × {item.quantity}
                                        </span>
                                        <span className="font-medium text-gray-900">
                                            Rp {item.subtotal.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">
                                        Rp {orderSummary.subtotal.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Ongkir</span>
                                    <span className="font-medium text-gray-900">
                                        Rp {orderSummary.shipping_cost.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                {orderSummary.payment_fee > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Biaya Pembayaran</span>
                                        <span className="font-medium text-gray-900">
                                            Rp {orderSummary.payment_fee.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                )}
                                <div className="border-t-2 border-gray-100 pt-3 mt-3">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-gray-900">
                                            Total
                                        </span>
                                        <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                                            Rp {orderSummary.total.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Address Modal */}
            <Modal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                title="Tambah Alamat Baru"
            >
                <AddressForm
                    onSubmit={handleAddressSubmit}
                    onCancel={() => setIsAddressModalOpen(false)}
                />
            </Modal>
        </div>
    );
}

export default function CheckoutClient() {
    return (
        <Suspense fallback={<div>Loading checkout...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}

