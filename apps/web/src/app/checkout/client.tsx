'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
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
        { number: 1, title: 'Alamat' },
        { number: 2, title: 'Pembayaran' },
        { number: 3, title: 'Review' },
    ];

    if (!cart && !isCartLoading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold">Keranjang Kosong</h1>
                <Button onClick={() => router.push('/products')} className="mt-4">Belanja Sekarang</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            </div>

            {/* Stepper */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex flex-1 items-center">
                            <div className="flex items-center">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold ${currentStep >= step.number
                                        ? 'border-primary-700 bg-primary-700 text-white'
                                        : 'border-gray-300 bg-white text-gray-400'
                                        }`}
                                >
                                    {step.number}
                                </div>
                                <span
                                    className={`ml-2 hidden font-medium md:block ${currentStep >= step.number
                                        ? 'text-gray-900'
                                        : 'text-gray-400'
                                        }`}
                                >
                                    {step.title}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`mx-4 h-0.5 flex-1 ${currentStep > step.number
                                        ? 'bg-primary-700'
                                        : 'bg-gray-300'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
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

                    {/* Navigation Buttons */}
                    <div className="mt-6 flex gap-3">
                        {currentStep > 1 && (
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => setCurrentStep((prev) => prev - 1)}
                                disabled={isProcessing}
                            >
                                Kembali
                            </Button>
                        )}
                        {currentStep < 3 ? (
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleNextStep}
                                className="flex-1"
                            >
                                Lanjutkan
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handlePlaceOrder}
                                isLoading={isProcessing}
                                className="flex-1"
                            >
                                Buat Pesanan
                            </Button>
                        )}
                    </div>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-20 rounded-lg border border-gray-200 bg-white p-6">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">
                            Ringkasan Pesanan
                        </h3>
                        <div className="space-y-3 border-b border-gray-200 pb-4">
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
                        <div className="mt-4 space-y-2">
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
                            <div className="border-t border-gray-200 pt-2">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-900">
                                        Total
                                    </span>
                                    <span className="text-lg font-bold text-primary-700">
                                        Rp {orderSummary.total.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
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
