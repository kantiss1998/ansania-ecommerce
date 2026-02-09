'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { useToast } from '@/components/ui/Toast';
import { authSchemas, LoginDTO } from '@repo/shared';

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
            success('Login berhasil!');
            router.push('/');
        } catch (err) {
            showError(authError || 'Login gagal. Silakan coba lagi.');
        }
    };

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 font-heading">
                    Selamat Datang Kembali
                </h1>
                <p className="mt-2 text-sm text-gray-500">
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

                <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    error={errors.password?.message}
                    {...register('password')}
                    required
                    endAdornment={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
                    }
                />

                <div className="flex items-center justify-between">
                    <Checkbox
                        label="Ingat saya"
                        {...register('remember_me')}
                    />

                    <Link
                        href="/auth/forgot-password"
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
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
                    className="shadow-primary-500/20 shadow-lg"
                >
                    Masuk
                </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                    Belum punya akun?{' '}
                    <Link
                        href="/auth/register"
                        className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
                    >
                        Daftar sekarang
                    </Link>
                </p>
            </div>
        </div>
    );
}
