'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { shippingService, Province, City } from '@/services/shippingService';

/**
 * Address data type
 */
import { Address, CreateAddressData } from '@/services/addressService';

export type { Address };

/**
 * Address form component
 */
export interface AddressFormProps {
    address?: Address;
    onSubmit: (data: CreateAddressData) => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

export function AddressForm({
    address,
    onSubmit,
    onCancel,
    isLoading = false,
}: AddressFormProps) {
    const [formData, setFormData] = useState<CreateAddressData>(
        address ? {
            recipient_name: address.recipient_name,
            phone: address.phone,
            address_line: address.address_line,
            city: address.city,
            province: address.province,
            postal_code: address.postal_code,
            is_default: address.is_default
        } : {
            recipient_name: '',
            phone: '',
            address_line: '',
            city: '',
            province: '',
            postal_code: '',
            is_default: false,
        }
    );

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: keyof CreateAddressData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.recipient_name.trim()) {
            newErrors.recipient_name = 'Nama penerima wajib diisi';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Nomor telepon wajib diisi';
        } else if (!/^(\+62|62|0)[0-9]{9,12}$/.test(formData.phone)) {
            newErrors.phone = 'Nomor telepon tidak valid';
        }

        if (!formData.address_line.trim()) {
            newErrors.address_line = 'Alamat lengkap wajib diisi';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'Kota/Kabupaten wajib diisi';
        }

        if (!formData.province.trim()) {
            newErrors.province = 'Provinsi wajib diisi';
        }

        if (!formData.postal_code.trim()) {
            newErrors.postal_code = 'Kode pos wajib diisi';
        } else if (!/^[0-9]{5}$/.test(formData.postal_code)) {
            newErrors.postal_code = 'Kode pos harus 5 digit';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [isProvincesLoading, setIsProvincesLoading] = useState(false);
    const [isCitiesLoading, setIsCitiesLoading] = useState(false);

    useEffect(() => {
        const fetchProvinces = async () => {
            setIsProvincesLoading(true);
            const data = await shippingService.getProvinces();
            setProvinces(data);
            setIsProvincesLoading(false);
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (formData.province_id) {
            const fetchCities = async () => {
                setIsCitiesLoading(true);
                const data = await shippingService.getCities(Number(formData.province_id));
                setCities(data);
                setIsCitiesLoading(false);
            };
            fetchCities();
        } else {
            setCities([]);
        }
    }, [formData.province_id]);

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceId = e.target.value;
        const provinceName = provinces.find(p => p.province_id === provinceId)?.province || '';

        setFormData(prev => ({
            ...prev,
            province_id: Number(provinceId),
            province: provinceName,
            city_id: 0,
            city: '',
            postal_code: ''
        }));
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cityId = e.target.value;
        const cityData = cities.find(c => c.city_id === cityId);

        setFormData(prev => ({
            ...prev,
            city_id: Number(cityId),
            city: cityData ? `${cityData.type} ${cityData.city_name}` : '',
            postal_code: cityData?.postal_code || prev.postal_code
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Nama Penerima"
                type="text"
                value={formData.recipient_name}
                onChange={(e) => handleChange('recipient_name', e.target.value)}
                error={errors.recipient_name}
                required
            />

            <Input
                label="Nomor Telepon"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                error={errors.phone}
                helperText="Contoh: 08123456789"
                required
            />

            <Input
                label="Alamat Lengkap"
                type="text"
                value={formData.address_line}
                onChange={(e) => handleChange('address_line', e.target.value)}
                error={errors.address_line}
                helperText="Nama jalan, nomor rumah, RT/RW"
                required
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Provinsi
                    </label>
                    <select
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700"
                        value={formData.province_id || ''}
                        onChange={handleProvinceChange}
                        disabled={isProvincesLoading}
                        required
                    >
                        <option value="">Pilih Provinsi</option>
                        {provinces.map(p => (
                            <option key={p.province_id} value={p.province_id}>{p.province}</option>
                        ))}
                    </select>
                    {errors.province && <p className="mt-1 text-xs text-red-500">{errors.province}</p>}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Kota/Kabupaten
                    </label>
                    <select
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700"
                        value={formData.city_id || ''}
                        onChange={handleCityChange}
                        disabled={!formData.province_id || isCitiesLoading}
                        required
                    >
                        <option value="">Pilih Kota/Kabupaten</option>
                        {cities.map(c => (
                            <option key={c.city_id} value={c.city_id}>{c.type} {c.city_name}</option>
                        ))}
                    </select>
                    {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                </div>
            </div>

            <Input
                label="Kode Pos"
                type="text"
                value={formData.postal_code}
                onChange={(e) => handleChange('postal_code', e.target.value)}
                error={errors.postal_code}
                maxLength={5}
                required
            />

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="is_default"
                    checked={formData.is_default || false}
                    onChange={(e) => handleChange('is_default', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-700 focus:ring-2 focus:ring-primary-700"
                />
                <label
                    htmlFor="is_default"
                    className="ml-2 text-sm text-gray-700"
                >
                    Jadikan alamat utama
                </label>
            </div>

            <div className="flex gap-3 pt-4">
                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isLoading}
                    className="flex-1"
                >
                    Simpan Alamat
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        size="md"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Batal
                    </Button>
                )}
            </div>
        </form>
    );
}
