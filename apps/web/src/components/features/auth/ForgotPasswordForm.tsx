"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { authSchemas } from "@repo/shared";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import apiClient, { getErrorMessage } from "@/lib/api";

type ForgotPasswordFormData = z.infer<typeof authSchemas.forgotPassword>;

/**
 * Forgot password form component
 */
export function ForgotPasswordForm() {
  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(authSchemas.forgotPassword),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await apiClient.post("/auth/forgot-password", { email: data.email });
      setEmailSent(true);
      success("Email reset password telah dikirim!");
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-2.5 shadow-sm border border-green-100/50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">
              Berhasil Terkirim
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-emerald-50">
              <Mail className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-gray-900 bg-clip-text text-transparent font-heading">
            Email Terkirim!
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Kami telah mengirimkan link reset password ke email Anda. Silakan
            cek inbox atau folder spam.
          </p>

          <div className="mt-8">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-50 to-purple-50 px-5 py-2-5 shadow-sm border border-primary-100/50">
          <Mail className="h-4 w-4 text-primary-600" />
          <span className="text-sm font-semibold text-primary-700">
            Lupa Password
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent font-heading">
          Reset Password
        </h1>
        <p className="text-base text-gray-600">
          Masukkan email Anda dan kami akan mengirimkan link untuk reset
          password
        </p>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email"
            type="email"
            placeholder="nama@example.com"
            error={errors.email?.message}
            {...register("email")}
            required
          />

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="shadow-lg hover:shadow-xl"
          >
            <Mail className="mr-2 h-5 w-5" />
            Kirim Link Reset
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke login
          </Link>
        </div>
      </div>
    </div>
  );
}
