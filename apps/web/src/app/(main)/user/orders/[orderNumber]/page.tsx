import { notFound } from "next/navigation";

import { OrderDetailView } from "@/components/features/order/OrderDetailView";
import { orderService } from "@/services/orderService";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  try {
    const order = await orderService.getOrder(orderNumber);
    return <OrderDetailView order={order} />;
  } catch (error) {
    notFound();
  }
}
