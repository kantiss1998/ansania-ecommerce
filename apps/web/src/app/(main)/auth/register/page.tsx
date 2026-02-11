import { Suspense } from 'react';

import { RegisterForm } from '@/components/features/auth/RegisterForm';

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterForm />
        </Suspense>
    );
}
