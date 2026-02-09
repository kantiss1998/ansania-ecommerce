import { cookies } from 'next/headers';
import AdminAttributesClient from './client';

export const dynamic = 'force-dynamic';

async function getAttributes() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return [];

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/admin/attributes`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            // Return mock data for development if API fails
            return [
                {
                    id: 1, name: 'Warna', code: 'color', type: 'select', is_required: true, values: [
                        { id: 1, attribute_id: 1, label: 'Hitam', value: 'black', extra_data: '#000000' },
                        { id: 2, attribute_id: 1, label: 'Putih', value: 'white', extra_data: '#ffffff' },
                        { id: 3, attribute_id: 1, label: 'Merah Marun', value: 'maroon', extra_data: '#800000' },
                    ]
                },
                {
                    id: 2, name: 'Ukuran', code: 'size', type: 'select', is_required: true, values: [
                        { id: 4, attribute_id: 2, label: 'XS', value: 'xs' },
                        { id: 5, attribute_id: 2, label: 'S', value: 's' },
                        { id: 6, attribute_id: 2, label: 'M', value: 'm' },
                        { id: 7, attribute_id: 2, label: 'L', value: 'l' },
                        { id: 8, attribute_id: 2, label: 'XL', value: 'xl' },
                    ]
                },
                {
                    id: 3, name: 'Bahan', code: 'material', type: 'select', is_required: false, values: [
                        { id: 9, attribute_id: 3, label: 'Katun', value: 'cotton' },
                        { id: 10, attribute_id: 3, label: 'Voal', value: 'voal' },
                        { id: 11, attribute_id: 3, label: 'Satin', value: 'satin' },
                    ]
                }
            ];
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error fetching attributes:', error);
        return [];
    }
}

export default async function AdminAttributesPage() {
    const attributes = await getAttributes();

    return (
        <div className="container mx-auto">
            <AdminAttributesClient attributes={attributes} />
        </div>
    );
}
