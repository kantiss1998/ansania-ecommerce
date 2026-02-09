'use client';

import { Address } from '@/services/addressService';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

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
                <h3 className="text-lg font-bold text-gray-900 font-heading">
                    Pilih Alamat Pengiriman
                </h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onAddNew}
                    className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                >
                    + Tambah Alamat Baru
                </Button>
            </div>

            {addresses.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center transition-all hover:border-gray-300">
                    <p className="text-gray-500 font-medium">Belum ada alamat tersimpan</p>
                    <Button
                        variant="primary"
                        onClick={onAddNew}
                        className="mt-4"
                    >
                        Tambah Alamat
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-1">
                    {addresses.map((address) => {
                        const isSelected = selectedId === address.id;
                        return (
                            <div
                                key={address.id}
                                onClick={() => onSelect(address)}
                                className={cn(
                                    "relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 ease-in-out",
                                    isSelected
                                        ? "border-primary-500 bg-primary-50/30 shadow-sm ring-1 ring-primary-500/20"
                                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                                )}
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-bold text-gray-900">
                                                {address.recipient_name}
                                            </h4>
                                            {address.is_default && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                                                    Utama
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 font-medium">
                                            {address.phone}
                                        </p>
                                        <div className="text-sm text-gray-500 leading-relaxed">
                                            <p>{address.address_line}</p>
                                            <p>{address.city}, {address.province} {address.postal_code}</p>
                                        </div>
                                    </div>

                                    {onEdit && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(address);
                                            }}
                                            className="text-gray-400 hover:text-primary-600 shrink-0"
                                        >
                                            Ubah
                                        </Button>
                                    )}
                                </div>

                                {isSelected && (
                                    <div className="absolute top-5 right-5 text-primary-500">
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
