'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import apiClient, { getErrorMessage } from '@/lib/api';

/**
 * Reset password form validation schema
 */
const resetPasswordSchema = z.object({
    password: z.string().min(8, 'Password minimal 8 karakter')
        .regex(/[A-Z]/, 'Password harus mengandung huruf kapital')
        .regex(/[0-9]/, 'Password harus mengandung angka'),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: 'Password tidak sama',
    path: ['password_confirmation'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Reset password form component
 */
export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
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
            showError('Token reset password tidak valid');
            return;
        }

        setIsLoading(true);
        try {
            await apiClient.post('/auth/reset-password', {
                token,
                password: data.password,
            });
            success('Password berhasil direset!');
            router.push('/auth/login');
        } catch (err) {
            showError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="rounded-lg bg-white p-8 shadow-lg text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                    Token Tidak Valid
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Link reset password tidak valid atau sudah kadaluarsa.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-lg bg-white p-8 shadow-lg">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                    Reset Password
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    Masukkan password baru untuk akun Anda
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="relative">
                    <Input
                        label="Password Baru"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimal 8 karakter"
                        helperText="Harus mengandung huruf kapital dan angka"
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

                <div className="relative">
                    <Input
                        label="Konfirmasi Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Ulangi password baru"
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

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isLoading}
                >
                    Reset Password
                </Button>
            </form>
        </div>
    );
}
