"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { authSchemas } from "@repo/shared";
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
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-50">
            <svg
              className="h-8 w-8 text-success-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 font-heading">
          Email Terkirim!
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Kami telah mengirimkan link reset password ke email Anda. Silakan cek
          inbox atau folder spam.
        </p>

        <div className="mt-8">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
          >
            ← Kembali ke login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">
          Lupa Password?
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Masukkan email Anda dan kami akan mengirimkan link untuk reset
          password
        </p>
      </div>

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
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          className="shadow-primary-500/20 shadow-lg"
        >
          Kirim Link Reset
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <Link
          href="/auth/login"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
        >
          ← Kembali ke login
        </Link>
      </div>
    </div>
  );
}
