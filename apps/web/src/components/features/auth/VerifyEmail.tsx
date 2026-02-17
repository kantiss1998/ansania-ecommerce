"use client";

import {
  CheckCircle,
  XCircle,
  Loader2,
  LogIn,
  RefreshCw,
  Home,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import apiClient, { getErrorMessage } from "@/lib/api";

export function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token verifikasi tidak ditemukan.");
      return;
    }

    const verifyEmail = async () => {
      try {
        await apiClient.post("/auth/verify-email", { token });
        setStatus("success");
      } catch (error) {
        setStatus("error");
        setMessage(getErrorMessage(error));
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
      {status === "verifying" && (
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 px-5 py-2.5 shadow-sm border border-blue-100/50">
              <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
              <span className="text-sm font-semibold text-blue-700">
                Memverifikasi
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-cyan-50">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent font-heading">
              Memverifikasi Email...
            </h1>
            <p className="mt-3 text-base text-gray-600">
              Mohon tunggu sebentar, kami sedang memvalidasi email Anda.
            </p>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-2.5 shadow-sm border border-green-100/50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">
                Berhasil Diverifikasi
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-emerald-50">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-gray-900 bg-clip-text text-transparent font-heading">
              Email Berhasil Diverifikasi!
            </h1>
            <p className="mt-3 text-base text-gray-600">
              Terima kasih telah memverifikasi email Anda. Akun Anda kini sudah
              aktif sepenuhnya.
            </p>
            <div className="mt-8 w-full">
              <Button
                variant="gradient"
                size="lg"
                fullWidth
                className="shadow-lg hover:shadow-xl"
                onClick={() => router.push("/auth/login")}
              >
                <LogIn className="mr-2 h-5 w-5" />
                Masuk Sekarang
              </Button>
            </div>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-50 to-orange-50 px-5 py-2.5 shadow-sm border border-red-100/50">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-semibold text-red-700">
                Verifikasi Gagal
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-orange-50">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading">
              Verifikasi Gagal
            </h1>
            <p className="mt-3 text-base text-gray-600">
              Maaf, kami tidak dapat memverifikasi email Anda.
            </p>
            {message && (
              <p className="mt-4 font-medium text-red-700 bg-red-50 px-4 py-2.5 rounded-xl text-sm">
                {message}
              </p>
            )}
            <div className="mt-8 space-y-3 w-full">
              <Button
                variant="gradient"
                size="lg"
                fullWidth
                className="shadow-lg hover:shadow-xl"
                onClick={() => router.push("/auth/register")}
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Daftar Ulang
              </Button>
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => router.push("/")}
              >
                <Home className="mr-2 h-5 w-5" />
                Kembali ke Beranda
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
