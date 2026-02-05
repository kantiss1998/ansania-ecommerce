'use client';

import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';

/**
 * User profile page
 */
export default function ProfilePage() {
    const { user, updateProfile } = useAuthStore();
    const { success, error } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateProfile(formData);
            success('Profile berhasil diperbarui');
            setIsEditing(false);
        } catch (err) {
            error('Gagal memperbarui profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            full_name: user?.full_name || '',
            email: user?.email || '',
            phone: user?.phone || '',
        });
        setIsEditing(false);
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                    Informasi Profil
                </h2>
                {!isEditing && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Profil
                    </Button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Nama Lengkap"
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    disabled={!isEditing}
                    required
                />

                <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    disabled={!isEditing}
                    required
                />

                <Input
                    label="Nomor Telepon"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    disabled={!isEditing}
                />

                {isEditing && (
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            isLoading={isLoading}
                            className="flex-1"
                        >
                            Simpan Perubahan
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="md"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                    </div>
                )}
            </form>

            {/* Account Stats */}
            <div className="mt-8 grid grid-cols-1 gap-4 border-t border-gray-200 pt-8 md:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                    <p className="text-2xl font-bold text-primary-700">12</p>
                    <p className="mt-1 text-sm text-gray-600">Total Pesanan</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                    <p className="text-2xl font-bold text-primary-700">5</p>
                    <p className="mt-1 text-sm text-gray-600">Wishlist</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                    <p className="text-2xl font-bold text-primary-700">3</p>
                    <p className="mt-1 text-sm text-gray-600">Alamat Tersimpan</p>
                </div>
            </div>
        </div>
    );
}
