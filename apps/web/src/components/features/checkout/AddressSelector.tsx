'use client';

import { Address } from '@/services/addressService';

/**
 * Address selector component
 */
export interface AddressSelectorProps {
    addresses: Address[];
    selectedId?: number;
    onSelect: (address: Address) => void;
    onAddNew: () => void;
    onEdit?: (address: Address) => void;
}

export function AddressSelector({
    addresses,
    selectedId,
    onSelect,
    onAddNew,
    onEdit,
}: AddressSelectorProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                    Pilih Alamat Pengiriman
                </h3>
                <button
                    onClick={onAddNew}
                    className="text-sm font-medium text-primary-700 hover:text-primary-800"
                >
                    + Tambah Alamat Baru
                </button>
            </div>

            {addresses.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                    <p className="text-gray-600">Belum ada alamat tersimpan</p>
                    <button
                        onClick={onAddNew}
                        className="mt-4 rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800"
                    >
                        Tambah Alamat
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${selectedId === address.id
                                ? 'border-primary-700 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                            onClick={() => onSelect(address)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-gray-900">
                                            {address.recipient_name}
                                        </h4>
                                        {address.is_default && (
                                            <span className="rounded bg-primary-700 px-2 py-0.5 text-xs font-medium text-white">
                                                Utama
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {address.phone}
                                    </p>
                                    <p className="mt-2 text-sm text-gray-700">
                                        {address.address_line}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        {address.city}, {address.province}{' '}
                                        {address.postal_code}
                                    </p>
                                </div>

                                {onEdit && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(address);
                                        }}
                                        className="ml-4 text-sm font-medium text-primary-700 hover:text-primary-800"
                                    >
                                        Ubah
                                    </button>
                                )}
                            </div>

                            {selectedId === address.id && (
                                <div className="mt-3 flex items-center text-sm text-primary-700">
                                    <svg
                                        className="mr-2 h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Alamat terpilih
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
