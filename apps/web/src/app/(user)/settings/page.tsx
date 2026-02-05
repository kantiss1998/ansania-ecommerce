'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useAuthStore } from '@/store/authStore';

/**
 * Account settings page
 */
export default function SettingsPage() {
    const { logout } = useAuthStore();
    const { success, error } = useToast();
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handlePasswordChange = (field: string, value: string) => {
        setPasswordForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const validatePassword = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!passwordForm.current_password) {
            newErrors.current_password = 'Password saat ini wajib diisi';
        }

        if (!passwordForm.new_password) {
            newErrors.new_password = 'Password baru wajib diisi';
        } else if (passwordForm.new_password.length < 8) {
            newErrors.new_password = 'Password minimal 8 karakter';
        }

        if (passwordForm.new_password !== passwordForm.confirm_password) {
            newErrors.confirm_password = 'Password tidak cocok';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePassword()) return;

        setIsLoading(true);
        try {
            // Will implement API call later
            await new Promise((resolve) => setTimeout(resolve, 1000));
            success('Password berhasil diubah');
            setPasswordForm({
                current_password: '',
                new_password: '',
                confirm_password: '',
            });
            setIsChangingPassword(false);
        } catch (err) {
            error('Gagal mengubah password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        if (!confirm('Apakah Anda yakin ingin keluar?')) return;
        await logout();
        window.location.href = '/';
    };

    return (
        <div className="space-y-6">
            {/* Password Section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Keamanan Akun
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Ubah password untuk keamanan akun Anda
                        </p>
                    </div>
                    {!isChangingPassword && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsChangingPassword(true)}
                        >
                            Ubah Password
                        </Button>
                    )}
                </div>

                {isChangingPassword && (
                    <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
                        <Input
                            label="Password Saat Ini"
                            type="password"
                            value={passwordForm.current_password}
                            onChange={(e) =>
                                handlePasswordChange('current_password', e.target.value)
                            }
                            error={errors.current_password}
                            required
                        />

                        <Input
                            label="Password Baru"
                            type="password"
                            value={passwordForm.new_password}
                            onChange={(e) =>
                                handlePasswordChange('new_password', e.target.value)
                            }
                            error={errors.new_password}
                            helperText="Minimal 8 karakter"
                            required
                        />

                        <Input
                            label="Konfirmasi Password Baru"
                            type="password"
                            value={passwordForm.confirm_password}
                            onChange={(e) =>
                                handlePasswordChange('confirm_password', e.target.value)
                            }
                            error={errors.confirm_password}
                            required
                        />

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                isLoading={isLoading}
                                className="flex-1"
                            >
                                Simpan Password
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="md"
                                onClick={() => {
                                    setIsChangingPassword(false);
                                    setPasswordForm({
                                        current_password: '',
                                        new_password: '',
                                        confirm_password: '',
                                    });
                                    setErrors({});
                                }}
                                disabled={isLoading}
                            >
                                Batal
                            </Button>
                        </div>
                    </form>
                )}
            </div>

            {/* Privacy Section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="text-xl font-semibold text-gray-900">
                    Privasi & Preferensi
                </h2>
                <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">
                                Notifikasi Email
                            </p>
                            <p className="text-sm text-gray-600">
                                Terima update pesanan via email
                            </p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input type="checkbox" className="peer sr-only" defaultChecked />
                            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-700 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">
                                Notifikasi Promo
                            </p>
                            <p className="text-sm text-gray-600">
                                Terima informasi promo dan penawaran spesial
                            </p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input type="checkbox" className="peer sr-only" defaultChecked />
                            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-700 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-lg border-2 border-error-DEFAULT bg-error-light p-6">
                <h2 className="text-xl font-semibold text-error-DEFAULT">
                    Zona Bahaya
                </h2>
                <p className="mt-2 text-sm text-gray-700">
                    Tindakan di bawah ini bersifat permanen dan tidak dapat dibatalkan.
                </p>
                <div className="mt-6 space-y-3">
                    <Button
                        variant="outline"
                        size="md"
                        onClick={handleLogout}
                        className="w-full border-error-DEFAULT text-error-DEFAULT hover:bg-error-DEFAULT hover:text-white"
                    >
                        Keluar dari Akun
                    </Button>
                </div>
            </div>
        </div>
    );
}
