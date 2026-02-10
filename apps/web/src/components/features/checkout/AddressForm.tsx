'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { shippingService, Province, City } from '@/services/shippingService';
import { Address, CreateAddressData } from '@/services/addressService';
import { Save, X } from 'lucide-react';

// Define schema locally since shared schema differs slightly (address_line vs address_line1)
// Ideally, we should unify this in the future
const addressFormSchema = z.object({
    recipient_name: z.string().min(2, 'Nama penerima wajib diisi'),
    phone: z.string().min(9, 'Nomor telepon wajib diisi').regex(/^(\+62|62|0)[0-9]{9,12}$/, 'Nomor telepon tidak valid'),
    address_line: z.string().min(5, 'Alamat lengkap wajib diisi'),
    province_id: z.coerce.number().min(1, 'Provinsi wajib diisi'),
    province: z.string().optional(),
    city_id: z.coerce.number().min(1, 'Kota/Kabupaten wajib diisi'),
    city: z.string().optional(),
    postal_code: z.string().length(5, 'Kode pos harus 5 digit').regex(/^[0-9]+$/, 'Kode pos harus angka'),
    is_default: z.boolean().optional(),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

export type { Address };

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
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm<AddressFormValues>({
        resolver: zodResolver(addressFormSchema),
        defaultValues: address ? {
            recipient_name: address.recipient_name,
            phone: address.phone,
            address_line: address.address_line,
            // Maps to strings or numbers based on backend response, assuming number for ID
            province_id: Number(address.province_id) || 0,
            province: address.province,
            city_id: Number(address.city_id) || 0,
            city: address.city,
            postal_code: address.postal_code,
            is_default: address.is_default
        } : {
            recipient_name: '',
            phone: '',
            address_line: '',
            province_id: 0,
            province: '',
            city_id: 0,
            city: '',
            postal_code: '',
            is_default: false,
        }
    });

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [isProvincesLoading, setIsProvincesLoading] = useState(false);
    const [isCitiesLoading, setIsCitiesLoading] = useState(false);

    const watchedProvinceId = watch('province_id');

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
        if (watchedProvinceId) {
            const fetchCities = async () => {
                setIsCitiesLoading(true);
                const data = await shippingService.getCities(Number(watchedProvinceId));
                setCities(data);
                setIsCitiesLoading(false);
            };
            fetchCities();
        } else {
            setCities([]);
        }
    }, [watchedProvinceId]);

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceId = Number(e.target.value);
        const provinceName = provinces.find(p => p.province_id === String(provinceId))?.province || '';

        setValue('province_id', provinceId);
        setValue('province', provinceName);
        setValue('city_id', 0); // Reset city
        setValue('city', '');
        setValue('postal_code', '');
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cityId = Number(e.target.value);
        const cityData = cities.find(c => c.city_id === String(cityId));

        setValue('city_id', cityId);
        setValue('city', cityData ? `${cityData.type} ${cityData.city_name}` : '');
        if (cityData?.postal_code) {
            setValue('postal_code', cityData.postal_code);
        }
    };

    const onFormSubmit = (data: AddressFormValues) => {
        onSubmit(data as CreateAddressData);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Nama Penerima"
                    {...register('recipient_name')}
                    error={errors.recipient_name?.message}
                    required
                    className="bg-gray-50/50"
                />

                <Input
                    label="Nomor Telepon"
                    type="tel"
                    {...register('phone')}
                    error={errors.phone?.message}
                    helperText="Contoh: 08123456789"
                    required
                    className="bg-gray-50/50"
                />
            </div>

            <Input
                label="Alamat Lengkap"
                {...register('address_line')}
                error={errors.address_line?.message}
                helperText="Nama jalan, nomor rumah, RT/RW"
                required
                className="bg-gray-50/50"
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <Select
                        label="Provinsi"
                        value={watchedProvinceId || ''}
                        onChange={handleProvinceChange}
                        disabled={isProvincesLoading}
                        error={errors.province_id?.message}
                        className="bg-gray-50/50"
                    >
                        <option value="">Pilih Provinsi</option>
                        {provinces.map(p => (
                            <option key={p.province_id} value={p.province_id}>{p.province}</option>
                        ))}
                    </Select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Kota/Kabupaten
                    </label>
                    <Controller
                        control={control}
                        name="city_id"
                        render={({ field }) => (
                            <Select
                                value={field.value || ''}
                                onChange={(e) => {
                                    field.onChange(e);
                                    handleCityChange(e);
                                }}
                                disabled={!watchedProvinceId || isCitiesLoading}
                                error={errors.city_id?.message}
                                className="bg-gray-50/50"
                            >
                                <option value="">Pilih Kota/Kabupaten</option>
                                {cities.map(c => (
                                    <option key={c.city_id} value={c.city_id}>{c.type} {c.city_name}</option>
                                ))}
                            </Select>
                        )}
                    />
                </div>
            </div>

            <Input
                label="Kode Pos"
                {...register('postal_code')}
                error={errors.postal_code?.message}
                maxLength={5}
                required
                className="bg-gray-50/50"
            />

            <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                <input
                    type="checkbox"
                    id="is_default"
                    {...register('is_default')}
                    className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
                <label
                    htmlFor="is_default"
                    className="ml-3 text-sm text-gray-700 font-medium cursor-pointer select-none"
                >
                    Jadikan sebagai alamat utama
                </label>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isLoading}
                    className="flex-1 shadow-lg shadow-primary-500/20"
                >
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Alamat
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="lg"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Batal
                    </Button>
                )}
            </div>
        </form>
    );
}
