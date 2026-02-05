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
 * Register form validation schema
 */
const registerSchema = z.object({
    full_name: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
    email: z.string().email('Email tidak valid'),
    phone: z.string().regex(/^(\+62|62|0)[0-9]{9,12}$/, 'Nomor telepon tidak valid'),
    password: z.string().min(8, 'Password minimal 8 karakter')
        .regex(/[A-Z]/, 'Password harus mengandung huruf kapital')
        .regex(/[0-9]/, 'Password harus mengandung angka'),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: 'Password tidak sama',
    path: ['password_confirmation'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Register form component with validation
 */
export function RegisterForm() {
    const router = useRouter();
    const { register: registerUser, isLoading, error: authError } = useAuthStore();
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
            success('Registrasi berhasil! Silakan login.');
            router.push('/auth/login');
        } catch (err) {
            showError(authError || 'Registrasi gagal. Silakan coba lagi.');
        }
    };

    return (
        <div className="rounded-lg bg-white p-8 shadow-lg">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                    Buat Akun Baru
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    Daftar untuk mulai berbelanja di Ansania
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                    label="Nama Lengkap"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    error={errors.full_name?.message}
                    {...register('full_name')}
                    required
                />

                <Input
                    label="Email"
                    type="email"
                    placeholder="nama@example.com"
                    error={errors.email?.message}
                    {...register('email')}
                    required
                />

                <Input
                    label="Nomor Telepon"
                    type="tel"
                    placeholder="081234567890"
                    helperText="Format: 08xx atau +62xx"
                    error={errors.phone?.message}
                    {...register('phone')}
                    required
                />

                <div className="relative">
                    <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimal 8 karakter"
                        error={errors.password?.message}
                        helperText="Harus mengandung huruf kapital dan angka"
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

                <div className="relative">
                    <Input
                        label="Konfirmasi Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Ulangi password"
                        error={errors.password_confirmation?.message}
                        {...register('password_confirmation')}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-9 text-sm text-gray-500 hover:text-gray-700"
                    >
                        {showConfirmPassword ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                </div>

                <div className="flex items-start">
                    <input
                        type="checkbox"
                        required
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-700 focus:ring-primary-700"
                    />
                    <label className="ml-2 text-sm text-gray-600">
                        Saya setuju dengan{' '}
                        <Link
                            href="/terms"
                            className="font-medium text-primary-700 hover:text-primary-800"
                        >
                            Syarat & Ketentuan
                        </Link>{' '}
                        dan{' '}
                        <Link
                            href="/privacy"
                            className="font-medium text-primary-700 hover:text-primary-800"
                        >
                            Kebijakan Privasi
                        </Link>
                    </label>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isLoading}
                >
                    Daftar
                </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Sudah punya akun?{' '}
                    <Link
                        href="/auth/login"
                        className="font-medium text-primary-700 hover:text-primary-800"
                    >
                        Masuk
                    </Link>
                </p>
            </div>
        </div>
    );
}
