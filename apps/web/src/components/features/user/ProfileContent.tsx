'use client';

import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/Toast';
import { orderService } from '@/services/orderService';
import { wishlistService } from '@/services/wishlistService';
import { addressService } from '@/services/addressService';
import { Package, Heart, MapPin, Edit2 } from 'lucide-react';

/**
 * User profile content
 */
export function ProfileContent() {
    const { user, updateProfile } = useAuthStore();
    const { success, error } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    const [stats, setStats] = useState({
        orders: 0,
        wishlist: 0,
        addresses: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [ordersRes, wishlistRes, addressesRes] = await Promise.all([
                    orderService.getOrders({ limit: 1 }),
                    wishlistService.getWishlist(),
                    addressService.getAddresses(),
                ]);

                setStats({
                    orders: ordersRes.meta?.total || 0,
                    wishlist: wishlistRes.length,
                    addresses: addressesRes.length,
                });
            } catch (err) {
                console.error('Failed to fetch profile stats', err);
            }
        };

        fetchStats();
    }, []);

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
                        className="flex items-center gap-2"
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit2 className="h-4 w-4" />
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
                <div className="rounded-lg bg-gray-50 p-4 text-center group hover:bg-primary-50 transition-colors">
                    <div className="mb-2 flex justify-center text-primary-200 group-hover:text-primary-300">
                        <Package className="h-8 w-8" />
                    </div>
                    <p className="text-2xl font-bold text-primary-700">{stats.orders}</p>
                    <p className="mt-1 text-sm font-medium text-gray-600">Total Pesanan</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 text-center group hover:bg-pink-50 transition-colors">
                    <div className="mb-2 flex justify-center text-pink-200 group-hover:text-pink-300">
                        <Heart className="h-8 w-8" />
                    </div>
                    <p className="text-2xl font-bold text-pink-600">{stats.wishlist}</p>
                    <p className="mt-1 text-sm font-medium text-gray-600">Wishlist</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 text-center group hover:bg-blue-50 transition-colors">
                    <div className="mb-2 flex justify-center text-blue-200 group-hover:text-blue-300">
                        <MapPin className="h-8 w-8" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{stats.addresses}</p>
                    <p className="mt-1 text-sm font-medium text-gray-600">Alamat Tersimpan</p>
                </div>
            </div>
        </div>
    );
}
