"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { authSchemas } from "@repo/shared";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { useAuthStore } from "@/store/authStore";

/**
 * Register form validation schema
 * Extends shared schema to include password confirmation
 */
const registerSchema = authSchemas.register
  .extend({
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password tidak sama",
    path: ["password_confirmation"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Register form component with validation
 */
export function RegisterForm() {
  const router = useRouter();
  const {
    register: registerUser,
    isLoading,
    error: authError,
  } = useAuthStore();
  const { success, error: showError } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        phone: data.phone,
      });
      success("Registrasi berhasil! Silakan login.");
      router.push("/auth/login");
    } catch (err) {
      showError(authError || "Registrasi gagal. Silakan coba lagi.");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">
          Buat Akun Baru
        </h1>
        <p className="text-gray-500">
          Daftar untuk mulai berbelanja di Ansania
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            error={errors.full_name?.message}
            {...register("full_name")}
            required
            className="bg-gray-50/50"
          />

          <Input
            label="Email"
            type="email"
            placeholder="nama@example.com"
            error={errors.email?.message}
            {...register("email")}
            required
            className="bg-gray-50/50"
          />

          <Input
            label="Nomor Telepon"
            type="tel"
            placeholder="081234567890"
            helperText="Format: 08xx atau +62xx"
            error={errors.phone?.message}
            {...register("phone")}
            required
            className="bg-gray-50/50"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 karakter"
              error={errors.password?.message}
              {...register("password")}
              required
              className="bg-gray-50/50"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
            />

            <Input
              label="Konfirmasi"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Ulangi password"
              error={errors.password_confirmation?.message}
              {...register("password_confirmation")}
              required
              className="bg-gray-50/50"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <Checkbox
                id="terms-checkbox"
                required
                label={
                  <span className="text-sm text-gray-600">
                    Saya setuju dengan{" "}
                    <Link
                      href="/terms-and-conditions"
                      className="font-medium text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                    >
                      Syarat & Ketentuan
                    </Link>{" "}
                    dan{" "}
                    <Link
                      href="/privacy-policy"
                      className="font-medium text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                    >
                      Kebijakan Privasi
                    </Link>
                  </span>
                }
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              className="shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Daftar Sekarang
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Sudah punya akun?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-colors"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
