import { BannerForm } from '@/components/features/admin/BannerForm';

export default function CreateBannerPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Buat Banner Baru</h1>
            <BannerForm />
        </div>
    );
}
