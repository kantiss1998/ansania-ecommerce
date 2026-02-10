'use client';

import { Address } from '@/services/addressService';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Plus, Check, MapPin, Edit2 } from 'lucide-react';

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
                <h3 className="text-lg font-bold text-gray-900 font-heading flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    Pilih Alamat Pengiriman
                </h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onAddNew}
                    className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Tambah Alamat
                </Button>
            </div>

            {addresses.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center transition-all hover:border-gray-300">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                        <MapPin className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium mb-4">Belum ada alamat tersimpan</p>
                    <Button
                        variant="primary"
                        onClick={onAddNew}
                        className="shadow-lg shadow-primary-500/20"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Alamat Baru
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
                                    "relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 ease-in-out group",
                                    isSelected
                                        ? "border-primary-500 bg-primary-50/30 shadow-md ring-1 ring-primary-500/20"
                                        : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-md"
                                )}
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-bold text-gray-900">
                                                {address.recipient_name}
                                            </h4>
                                            {address.is_default && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">
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
                                            className="text-gray-400 hover:text-primary-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Edit2 className="h-4 w-4 mr-1" />
                                            Ubah
                                        </Button>
                                    )}
                                </div>

                                {isSelected && (
                                    <div className="absolute top-4 right-4 text-primary-600 bg-white rounded-full p-1 shadow-sm">
                                        <Check className="h-5 w-5" />
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
