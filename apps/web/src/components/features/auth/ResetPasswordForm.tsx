"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import apiClient, { getErrorMessage } from "@/lib/api";

/**
 * Reset password form validation schema
 */
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Password harus mengandung huruf kapital")
      .regex(/[0-9]/, "Password harus mengandung angka"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password tidak sama",
    path: ["password_confirmation"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Reset password form component
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      showError("Token reset password tidak valid");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post("/auth/reset-password", {
        token,
        password: data.password,
      });
      success("Password berhasil direset!");
      router.push("/auth/login");
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-50 to-orange-50 px-5 py-2.5 shadow-sm border border-red-100/50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-semibold text-red-700">
              Token Tidak Valid
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-orange-50">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading">
            Token Tidak Valid
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Link reset password tidak valid atau sudah kadaluarsa.
          </p>
          <div className="mt-8">
            <Link href="/auth/forgot-password">
              <Button variant="gradient" className="shadow-lg hover:shadow-xl">
                Minta Link Baru
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-50 to-purple-50 px-5 py-2.5 shadow-sm border border-primary-100/50">
          <Lock className="h-4 w-4 text-primary-600" />
          <span className="text-sm font-semibold text-primary-700">
            Keamanan Akun
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent font-heading">
          Reset Password
        </h1>
        <p className="text-base text-gray-600">
          Masukkan password baru untuk akun Anda
        </p>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Password Baru"
            type={showPassword ? "text" : "password"}
            placeholder="Minimal 8 karakter"
            helperText="Harus mengandung huruf kapital dan angka"
            error={errors.password?.message}
            {...register("password")}
            required
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
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
            label="Konfirmasi Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Ulangi password baru"
            error={errors.password_confirmation?.message}
            {...register("password_confirmation")}
            required
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            }
          />

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="shadow-lg hover:shadow-xl"
          >
            <Lock className="mr-2 h-5 w-5" />
            Reset Password
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link
            href="/auth/login"
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Kembali ke login
          </Link>
        </div>
      </div>
    </div>
  );
}
