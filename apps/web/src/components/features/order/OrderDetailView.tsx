"use client";

import { ORDER_STATUS } from "@repo/shared/constants";
import {
  Package,
  ShoppingBag,
  MapPin,
  Receipt,
  CreditCard,
  HelpCircle,
  Star,
} from "lucide-react";
import { useState } from "react";

import {
  ReviewForm,
  ReviewData,
} from "@/components/features/reviews/ReviewForm";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import apiClient, { getErrorMessage } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/services/orderService";

interface OrderDetailViewProps {
  order: Order;
}

export function OrderDetailView({ order }: OrderDetailViewProps) {
  const { success, error } = useToast();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const statusConfig: Record<
    string,
    {
      label: string;
      variant: "warning" | "info" | "success" | "error" | "default";
    }
  > = {
    [ORDER_STATUS.PENDING_PAYMENT]: {
      label: "Menunggu Pembayaran",
      variant: "warning",
    },
    [ORDER_STATUS.PROCESSING]: { label: "Diproses", variant: "info" },
    [ORDER_STATUS.SHIPPED]: { label: "Dikirim", variant: "info" },
    [ORDER_STATUS.DELIVERED]: { label: "Selesai", variant: "success" },
    [ORDER_STATUS.CANCELLED]: { label: "Dibatalkan", variant: "error" },
    [ORDER_STATUS.REFUNDED]: { label: "Dikembalikan", variant: "default" },
    [ORDER_STATUS.FAILED]: { label: "Gagal", variant: "error" },
  };

  const config = statusConfig[order.status] || {
    label: order.status,
    variant: "default",
  };

  const handleOpenReview = (productId: number, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (data: ReviewData) => {
    if (!selectedProduct) return;

    setIsLoading(true);
    try {
      await apiClient.post(`/products/${selectedProduct.id}/reviews`, data);
      success("Ulasan berhasil dikirim!");
      setReviewModalOpen(false);
      // Optionally refresh order data or disable review button for this item
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-primary-50 p-2 rounded-lg text-primary-600">
                <Package className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 font-heading">
                Order #{order.order_number}
              </h1>
            </div>
            <p className="mt-1 text-sm text-gray-500 ml-11">
              Dipesan pada{" "}
              {new Date(order.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <Badge variant={config.variant} className="self-start md:self-center">
            {config.label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-gray-500" />
                Item Pesanan
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 p-6 sm:flex-row hover:bg-gray-50/30 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <h3 className="font-bold text-gray-900">
                      {item.product_name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      {item.variant_info}
                    </p>
                    <div className="mt-2 text-sm text-gray-600 bg-gray-50 inline-block px-2 py-1 rounded">
                      {item.quantity} x {formatCurrency(item.price)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className="font-bold text-gray-900 text-lg">
                      {formatCurrency(item.subtotal)}
                    </div>
                    {order.status === ORDER_STATUS.DELIVERED && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleOpenReview(item.id, item.product_name)
                        }
                        className="gap-2"
                      >
                        <Star className="h-4 w-4" />
                        Tulis Ulasan
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6 lg:col-span-1">
          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                Alamat Pengiriman
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-bold text-gray-900">
                    {order.shipping_address.recipient_name}
                  </p>
                  <p className="text-sm text-gray-500 font-medium">
                    {order.shipping_address.phone}
                  </p>
                </div>
                <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p>{order.shipping_address.address_line}</p>
                  <p>
                    {order.shipping_address.city},{" "}
                    {order.shipping_address.province}{" "}
                    {order.shipping_address.postal_code}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-gray-900 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-gray-500" />
              Rincian Pembayaran
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-gray-600 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Metode
                </span>
                <span className="font-bold text-gray-900 uppercase tracking-wide text-xs">
                  {order.payment_method?.replace("_", " ")}
                </span>
              </div>

              <div className="pt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(
                      order.items?.reduce((acc, i) => acc + i.subtotal, 0) || 0,
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ongkir</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(order.shipping_cost)}
                  </span>
                </div>
                <div className="mt-4 flex justify-between border-t border-dashed border-gray-200 pt-4 text-base">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-primary-700 text-lg font-heading">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/contact-us")}
              className="w-full gap-2 hover:bg-gray-50 hover:text-primary-600 hover:border-primary-200 transition-all"
            >
              <HelpCircle className="h-4 w-4" />
              Bantuan Pesanan
            </Button>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={`Ulasan untuk ${selectedProduct?.name}`}
      >
        <ReviewForm
          onSubmit={handleSubmitReview}
          onCancel={() => setReviewModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
}
