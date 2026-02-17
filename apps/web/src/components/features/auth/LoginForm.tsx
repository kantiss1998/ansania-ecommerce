"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { authSchemas, LoginDTO } from "@repo/shared";
import { USER_ROLES } from "@repo/shared/constants";
import { Eye, EyeOff, LogIn, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { useAuthStore } from "@/store/authStore";

type LoginFormData = LoginDTO;

/**
 * Login form component with validation
 */
export function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error: authError } = useAuthStore();
  const { success, error: showError } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(authSchemas.login),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      success("Login berhasil!");

      // Get user from store to check role
      const user = useAuthStore.getState().user;
      if (user?.role === USER_ROLES.ADMIN) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      showError(authError || "Login gagal. Silakan coba lagi.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-50 to-purple-50 px-5 py-2.5 shadow-sm border border-primary-100/50">
          <Sparkles className="h-4 w-4 text-primary-600" />
          <span className="text-sm font-semibold text-primary-700">
            Selamat Datang
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent font-heading">
          Masuk ke Ansania
        </h1>
        <p className="text-base text-gray-600">
          Masuk untuk mengakses akun Anda
        </p>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email"
            type="email"
            placeholder="contoh@email.com"
            error={errors.email?.message}
            {...register("email")}
            required
            className="bg-gray-50/50"
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password Anda"
              error={errors.password?.message}
              {...register("password")}
              required
              className="bg-gray-50/50"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  title={
                    showPassword ? "Sembunyikan password" : "Lihat password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
            />
            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline transition-colors"
              >
                Lupa password?
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <Checkbox
              label="Ingat saya"
              id="remember-me"
              {...register("remember_me")}
            />
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="shadow-lg hover:shadow-xl"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Masuk Sekarang
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Belum punya akun?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-colors"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
