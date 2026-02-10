import { Suspense } from 'react';
import { VerifyEmailContent } from '@/components/features/auth/VerifyEmail';

export const dynamic = 'force-dynamic';

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-gray-500">Memuat verifikasi...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}
