'use client';

import { useState, useEffect } from 'react';
import { AddressForm } from '@/components/features/checkout/AddressForm';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { addressService, Address } from '@/services/addressService';
import { getErrorMessage } from '@/lib/api';

/**
 * Addresses management page
 */
export default function AddressesPage() {
    const { success, error } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAddresses = async () => {
        setIsLoading(true);
        try {
            const data = await addressService.getAddresses();
            setAddresses(data);
        } catch (err) {
            error(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleAddNew = () => {
        setEditingAddress(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    const handleSubmit = async (formData: any) => {
        try {
            if (editingAddress) {
                await addressService.updateAddress(editingAddress.id, formData);
                success('Alamat berhasil diperbarui');
            } else {
                await addressService.createAddress(formData);
                success('Alamat berhasil disimpan');
            }
            setIsModalOpen(false);
            fetchAddresses();
        } catch (err) {
            error(getErrorMessage(err));
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus alamat ini?')) return;

        try {
            await addressService.deleteAddress(id);
            success('Alamat berhasil dihapus');
            fetchAddresses();
        } catch (err) {
            error(getErrorMessage(err));
        }
    };

    const handleSetDefault = async (id: number) => {
        try {
            // Usually setting default involves updating the specific address to is_default: true
            // The backend should handle unsetting others
            await addressService.updateAddress(id, { ...addresses.find(a => a.id === id)!, is_default: true });
            success('Alamat utama berhasil diubah');
            fetchAddresses();
        } catch (err) {
            error(getErrorMessage(err));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Alamat Tersimpan
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Kelola alamat pengiriman Anda
                    </p>
                </div>
                <Button variant="primary" size="md" onClick={handleAddNew}>
                    + Tambah Alamat
                </Button>
            </div>

            {/* Addresses List */}
            {isLoading ? (
                <div className="flex justify-center p-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-700 border-t-transparent"></div>
                </div>
            ) : addresses.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                    <svg
                        className="mx-auto h-16 w-16 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                    <p className="mt-4 text-lg font-medium text-gray-900">
                        Belum Ada Alamat
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                        Tambahkan alamat untuk memudahkan proses checkout
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className="rounded-lg border border-gray-200 bg-white p-6"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900">
                                            {address.recipient_name}
                                        </h3>
                                        {address.is_default && (
                                            <Badge variant="primary">Alamat Utama</Badge>
                                        )}
                                    </div>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {address.phone}
                                    </p>
                                    <p className="mt-2 text-sm text-gray-700">
                                        {address.address_line}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        {address.city}, {address.province} {address.postal_code}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(address)}
                                >
                                    Ubah
                                </Button>
                                {!address.is_default && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSetDefault(address.id)}
                                        >
                                            Jadikan Utama
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(address.id)}
                                            className="text-error-DEFAULT hover:bg-error-light"
                                        >
                                            Hapus
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Address Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingAddress ? 'Ubah Alamat' : 'Tambah Alamat Baru'}
            >
                <AddressForm
                    address={editingAddress}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
