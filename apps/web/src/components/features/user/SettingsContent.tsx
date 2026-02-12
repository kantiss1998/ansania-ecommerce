"use client";

import { motion } from "framer-motion";
import { Lock, Bell, LogOut, Sparkles, AlertTriangle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { useAuthStore } from "@/store/authStore";

/**
 * Account settings content
 */
export function SettingsContent() {
  const { logout } = useAuthStore();
  const { success, error } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [notifications, setNotifications] = useState({
    email: true,
    promo: true,
  });

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validatePassword = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!passwordForm.current_password) {
      newErrors.current_password = "Password saat ini wajib diisi";
    }

    if (!passwordForm.new_password) {
      newErrors.new_password = "Password baru wajib diisi";
    } else if (passwordForm.new_password.length < 8) {
      newErrors.new_password = "Password minimal 8 karakter";
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      newErrors.confirm_password = "Password tidak cocok";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      // Will implement API call later
      await new Promise((resolve) => setTimeout(resolve, 1000));
      success("Password berhasil diubah");
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setIsChangingPassword(false);
    } catch (err) {
      error("Gagal mengubah password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm("Apakah Anda yakin ingin keluar?")) return;
    await logout();
    window.location.href = "/";
  };

  const toggleNotification = (key: "email" | "promo") => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    success(
      `Notifikasi ${key === "email" ? "Email" : "Promo"} ${!notifications[key] ? "diaktifkan" : "dinonaktifkan"}`,
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-50 to-purple-50 px-4 py-2 mb-4">
          <Sparkles className="h-4 w-4 text-primary-600" />
          <span className="text-sm font-semibold text-primary-700">
            Pengaturan Akun
          </span>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent font-heading">
          Pengaturan
        </h1>
        <p className="mt-2 text-gray-600">
          Kelola keamanan dan preferensi akun Anda
        </p>
      </motion.div>

      {/* Password Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-lg"
      >
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full blur-3xl opacity-30"></div>

        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 p-3 shadow-md">
                <Lock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Keamanan Akun
                </h2>
                <p className="text-sm text-gray-600">
                  Ubah password untuk keamanan akun Anda
                </p>
              </div>
            </div>
            {!isChangingPassword && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChangingPassword(true)}
                className="border-2"
              >
                Ubah Password
              </Button>
            )}
          </div>

          {isChangingPassword && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handlePasswordSubmit}
              className="mt-6 space-y-4"
            >
              <Input
                label="Password Saat Ini"
                type="password"
                value={passwordForm.current_password}
                onChange={(e) =>
                  handlePasswordChange("current_password", e.target.value)
                }
                error={errors.current_password}
                required
              />

              <Input
                label="Password Baru"
                type="password"
                value={passwordForm.new_password}
                onChange={(e) =>
                  handlePasswordChange("new_password", e.target.value)
                }
                error={errors.new_password}
                helperText="Minimal 8 karakter"
                required
              />

              <Input
                label="Konfirmasi Password Baru"
                type="password"
                value={passwordForm.confirm_password}
                onChange={(e) =>
                  handlePasswordChange("confirm_password", e.target.value)
                }
                error={errors.confirm_password}
                required
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  variant="gradient"
                  size="md"
                  isLoading={isLoading}
                  className="flex-1 shadow-lg"
                >
                  Simpan Password
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordForm({
                      current_password: "",
                      new_password: "",
                      confirm_password: "",
                    });
                    setErrors({});
                  }}
                  disabled={isLoading}
                  className="border-2"
                >
                  Batal
                </Button>
              </div>
            </motion.form>
          )}
        </div>
      </motion.div>

      {/* Privacy Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-lg"
      >
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full blur-3xl opacity-30"></div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 p-3 shadow-md">
              <Bell className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Privasi & Preferensi
              </h2>
              <p className="text-sm text-gray-600">
                Atur notifikasi dan preferensi Anda
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-100">
              <div>
                <p className="font-semibold text-gray-900">Notifikasi Email</p>
                <p className="text-sm text-gray-600">
                  Terima update pesanan via email
                </p>
              </div>
              <button
                onClick={() => toggleNotification("email")}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  notifications.email
                    ? "bg-gradient-to-r from-primary-600 to-purple-600"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                    notifications.email ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-100">
              <div>
                <p className="font-semibold text-gray-900">Notifikasi Promo</p>
                <p className="text-sm text-gray-600">
                  Terima informasi promo dan penawaran spesial
                </p>
              </div>
              <button
                onClick={() => toggleNotification("promo")}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  notifications.promo
                    ? "bg-gradient-to-r from-primary-600 to-purple-600"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                    notifications.promo ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative overflow-hidden rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-6 shadow-lg"
      >
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full blur-3xl opacity-40"></div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex rounded-xl bg-gradient-to-br from-red-100 to-orange-100 p-3 shadow-md">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-red-700 to-orange-700 bg-clip-text text-transparent">
                Zona Bahaya
              </h2>
              <p className="text-sm text-gray-700">
                Tindakan di bawah ini bersifat permanen
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              size="md"
              onClick={handleLogout}
              className="w-full border-2 border-red-500 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-md hover:shadow-lg"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar dari Akun
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
