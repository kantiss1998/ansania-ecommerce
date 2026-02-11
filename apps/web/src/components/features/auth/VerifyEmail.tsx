'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import apiClient, { getErrorMessage } from '@/lib/api';

export function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Token verifikasi tidak ditemukan.');
            return;
        }

        const verifyEmail = async () => {
            try {
                await apiClient.post('/auth/verify-email', { token });
                setStatus('success');
            } catch (error) {
                setStatus('error');
                setMessage(getErrorMessage(error));
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
            {status === 'verifying' && (
                <div className="flex flex-col items-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600"></div>
                    <h1 className="mt-6 text-2xl font-bold text-gray-900">Memverifikasi Email...</h1>
                    <p className="mt-2 text-gray-600">Mohon tunggu sebentar, kami sedang memvalidasi email Anda.</p>
                </div>
            )}

            {status === 'success' && (
                <div className="flex flex-col items-center max-w-md">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success-50">
                        <svg className="h-10 w-10 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="mt-6 text-2xl font-bold text-gray-900">Email Berhasil Diverifikasi!</h1>
                    <p className="mt-2 text-gray-600">
                        Terima kasih telah memverifikasi email Anda. Akun Anda kini sudah aktif sepenuhnya.
                    </p>
                    <div className="mt-8 w-full">
                        <Button
                            variant="primary"
                            size="lg"
                            className="w-full"
                            onClick={() => router.push('/auth/login')}
                        >
                            Masuk Sekarang
                        </Button>
                    </div>
                </div>
            )}

            {status === 'error' && (
                <div className="flex flex-col items-center max-w-md">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-error-50">
                        <svg className="h-10 w-10 text-error-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="mt-6 text-2xl font-bold text-gray-900">Verifikasi Gagal</h1>
                    <p className="mt-2 text-gray-600">
                        Maaf, kami tidak dapat memverifikasi email Anda.
                    </p>
                    <p className="mt-1 font-medium text-error-600 bg-error-50 px-3 py-1 rounded">
                        {message}
                    </p>
                    <div className="mt-8 space-y-3 w-full">
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={() => router.push('/auth/request-verification')}
                        >
                            Kirim Ulang Email Verifikasi
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            fullWidth
                            onClick={() => router.push('/')}
                        >
                            Kembali ke Beranda
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
