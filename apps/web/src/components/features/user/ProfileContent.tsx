"use client";

import { motion } from "framer-motion";
import {
  Package,
  Heart,
  MapPin,
  Edit2,
  User,
  Sparkles,
  Camera,
} from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { addressService } from "@/services/addressService";
import { orderService } from "@/services/orderService";
import { wishlistService } from "@/services/wishlistService";
import { useAuthStore } from "@/store/authStore";

/**
 * User profile content
 */
export function ProfileContent() {
  const { user, updateProfile } = useAuthStore();
  const { success, error } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [stats, setStats] = useState({
    orders: 0,
    wishlist: 0,
    addresses: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, wishlistRes, addressesRes] = await Promise.all([
          orderService.getOrders({ limit: 1 }),
          wishlistService.getWishlist(),
          addressService.getAddresses(),
        ]);

        setStats({
          orders: ordersRes.meta?.total || 0,
          wishlist: wishlistRes.length,
          addresses: addressesRes.length,
        });
      } catch (err) {
        console.error("Failed to fetch profile stats", err);
      }
    };

    fetchStats();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(formData);
      success("Profile berhasil diperbarui");
      setIsEditing(false);
    } catch (err) {
      error("Gagal memperbarui profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
  };

  const statsCards = [
    {
      title: "Total Pesanan",
      value: stats.orders,
      icon: Package,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      title: "Wishlist",
      value: stats.wishlist,
      icon: Heart,
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50",
    },
    {
      title: "Alamat Tersimpan",
      value: stats.addresses,
      icon: MapPin,
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-50 to-indigo-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-xl"
      >
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-50 to-purple-50 rounded-full blur-3xl opacity-30"></div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-50 to-purple-50 px-5 py-2.5 shadow-sm border border-primary-100/50 mb-6">
            <Sparkles className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">
              Profil Saya
            </span>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="h-28 w-28 rounded-3xl bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center shadow-lg">
                  <User className="h-14 w-14 text-primary-600" />
                </div>
                <button className="absolute bottom-0 right-0 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 p-2.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* User Info */}
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent font-heading">
                  {user?.full_name || "User"}
                </h2>
                <p className="mt-2 text-base text-gray-600">{user?.email}</p>
              </div>
            </div>

            {!isEditing && (
              <Button
                variant="gradient"
                size="sm"
                className="flex items-center gap-2 shadow-lg hover:shadow-xl"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
                Edit Profil
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl"
      >
        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
          Informasi Profil
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap"
            type="text"
            value={formData.full_name}
            onChange={(e) => handleChange("full_name", e.target.value)}
            disabled={!isEditing}
            required
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            disabled={!isEditing}
            required
          />

          <Input
            label="Nomor Telepon"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            disabled={!isEditing}
          />

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="gradient"
                size="md"
                isLoading={isLoading}
                className="flex-1 shadow-lg"
              >
                Simpan Perubahan
              </Button>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleCancel}
                disabled={isLoading}
                className="border-2"
              >
                Batal
              </Button>
            </div>
          )}
        </form>
      </motion.div>

      {/* Account Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl cursor-pointer"
          >
            {/* Decorative blur */}
            <div
              className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.bgGradient} rounded-full blur-2xl opacity-30`}
            ></div>

            <div className="relative">
              <div
                className={`inline-flex rounded-xl bg-gradient-to-br ${stat.bgGradient} p-3 shadow-md mb-4`}
              >
                <stat.icon
                  className={`h-6 w-6 bg-gradient-to-r ${stat.gradient} bg-clip-text`}
                  style={{ WebkitTextFillColor: "transparent" }}
                />
              </div>
              <p
                className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
              >
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-gray-600">
                {stat.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
