'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

/**
 * Login form validation schema
 */
const loginSchema = z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormData = z.infer<typeof loginSchema>;

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
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data.email, data.password);
            success('Login berhasil!');
            router.push('/');
        } catch (err) {
            showError(authError || 'Login gagal. Silakan coba lagi.');
        }
    };

    return (
        <div className="rounded-lg bg-white p-8 shadow-lg">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                    Selamat Datang Kembali
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    Masuk ke akun Ansania Anda
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label="Email"
                    type="email"
                    placeholder="nama@example.com"
                    error={errors.email?.message}
                    {...register('email')}
                    required
                />

                <div className="relative">
                    <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Masukkan password"
                        error={errors.password?.message}
                        {...register('password')}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-sm text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary-700 focus:ring-primary-700"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                            Ingat saya
                        </span>
                    </label>

                    <Link
                        href="/auth/forgot-password"
                        className="text-sm font-medium text-primary-700 hover:text-primary-800"
                    >
                        Lupa password?
                    </Link>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isLoading}
                >
                    Masuk
                </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Belum punya akun?{' '}
                    <Link
                        href="/auth/register"
                        className="font-medium text-primary-700 hover:text-primary-800"
                    >
                        Daftar sekarang
                    </Link>
                </p>
            </div>
        </div>
    );
}
