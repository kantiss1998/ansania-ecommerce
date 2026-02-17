"use client";

import { ORDER_STATUS } from "@repo/shared/constants";
import { motion } from "framer-motion";
import { ShoppingBag, Search, Package } from "lucide-react";
import { useState, Suspense, useEffect } from "react";

import { OrderCard } from "@/components/features/dashboard/OrderCard";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { orderService, Order } from "@/services/orderService";

function OrdersContent() {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { error } = useToast();

  const tabs = [
    {
      key: "all" as const,
      label: "Semua",
      gradient: "from-gray-500 to-gray-600",
    },
    {
      key: ORDER_STATUS.PENDING_PAYMENT,
      label: "Belum Bayar",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      key: ORDER_STATUS.PROCESSING,
      label: "Diproses",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      key: ORDER_STATUS.SHIPPED,
      label: "Dikirim",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      key: ORDER_STATUS.DELIVERED,
      label: "Selesai",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const params = activeTab !== "all" ? { status: activeTab } : {};
        const response = await orderService.getOrders({ ...params, limit: 50 });
        setOrders(response.items);
      } catch (err) {
        console.error("Failed to fetch orders", err);
        error("Gagal memuat pesanan");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [activeTab, error]);

  // Filter orders by search query
  const filteredOrders = orders.filter((order) =>
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-50 to-purple-50 px-5 py-2.5 shadow-sm border border-primary-100/50 mb-4">
          <Package className="h-4 w-4 text-primary-600" />
          <span className="text-sm font-semibold text-primary-700">
            Riwayat Pesanan
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent font-heading">
          Pesanan Saya
        </h2>
        <p className="mt-3 text-base text-gray-600">
          Kelola dan lacak pesanan Anda
        </p>

        {/* Search Bar */}
        <div className="mt-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nomor pesanan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all font-medium"
          />
        </div>
      </motion.div>

      {/* Enhanced Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="overflow-x-auto scrollbar-hide"
      >
        <div className="flex gap-3 pb-2">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              onClick={() => setActiveTab(tab.key)}
              className={`relative whitespace-nowrap rounded-2xl px-5 py-3 text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-gradient-to-r " +
                    tab.gradient +
                    " text-white shadow-lg scale-105"
                  : "text-gray-600 hover:bg-gray-100 bg-white border border-gray-200"
              }`}
            >
              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r"
                  style={{
                    background: `linear-gradient(to right, var(--tw-gradient-stops))`,
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Orders List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center"
        >
          <div className="inline-flex rounded-full bg-gradient-to-br from-primary-50 to-purple-50 p-5 mb-6">
            <ShoppingBag className="h-14 w-14 text-primary-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {searchQuery ? "Pesanan Tidak Ditemukan" : "Belum Ada Pesanan"}
          </p>
          <p className="mt-3 text-base text-gray-600">
            {searchQuery
              ? "Coba kata kunci lain atau hapus filter"
              : "Pesanan Anda akan muncul di sini"}
          </p>
          {!searchQuery && (
            <Button
              variant="gradient"
              size="md"
              className="mt-6 shadow-lg hover:shadow-xl"
              onClick={() => (window.location.href = "/products")}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Mulai Belanja
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
            >
              <OrderCard order={order} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function UserOrdersClient() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
