'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import adminCmsService from '@/services/adminCmsService';
import { CMSPage } from '@/services/cmsService';

export default function AdminPagesList() {
    const [pages, setPages] = useState<CMSPage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPages();
    }, []);

    async function loadPages() {
        try {
            const data = await adminCmsService.getAllPages();
            setPages(data);
        } catch (error) {
            console.error('Failed to load pages:', error);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) return <div className="p-8">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">CMS Pages</h1>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Slug
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Last Updated
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {pages.map((page) => (
                            <tr key={page.id}>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">
                                        {page.title}
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                                        {page.slug}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {page.publishedAt ? new Date(page.publishedAt).toLocaleDateString() : '-'}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <Link
                                        href={`/admin/pages/${page.id}`}
                                        className="text-primary-600 hover:text-primary-900"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
