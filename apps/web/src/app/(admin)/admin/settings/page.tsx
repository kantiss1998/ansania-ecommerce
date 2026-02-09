import { cookies } from 'next/headers';
import AdminSettingsClient from './client';

export const dynamic = 'force-dynamic';

async function getSettings() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return null;

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        const response = await fetch(`${baseUrl}/api/admin/cms/settings`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return null;

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error fetching settings:', error);
        return null;
    }
}

export default async function AdminSettingsPage() {
    const settings = await getSettings();

    return <AdminSettingsClient initialSettings={settings} />;
}
