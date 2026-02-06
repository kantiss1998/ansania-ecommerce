'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import adminCmsService, { UpdatePageRequest } from '@/services/adminCmsService';

// Note: params is a Promise in recent Next.js versions for dynamic routes
export default function AdminPageEdit({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    // Unwrap params using React.use()
    const { id } = use(params);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<UpdatePageRequest>({
        title: '',
        content: '',
        meta_title: '',
        meta_description: '',
    });
    const [slug, setSlug] = useState('');

    useEffect(() => {
        if (id) {
            loadPage(Number(id));
        }
    }, [id]);

    async function loadPage(pageId: number) {
        try {
            const page = await adminCmsService.getPageById(pageId);
            if (page) {
                setFormData({
                    title: page.title,
                    content: page.content,
                    meta_title: page.meta_title || '',
                    meta_description: page.meta_description || '',
                });
                setSlug(page.slug);
            }
        } catch (error) {
            console.error('Failed to load page:', error);
            alert('Failed to load page details');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSaving(true);
        try {
            await adminCmsService.updatePage(Number(id), formData);
            alert('Page updated successfully');
            router.push('/admin/pages');
        } catch (error) {
            console.error('Failed to update page:', error);
            alert('Failed to update page');
        } finally {
            setIsSaving(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (isLoading) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Edit Page: {formData.title}</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-6">
                    {/* Slug (ReadOnly) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Slug</label>
                        <input
                            type="text"
                            value={slug}
                            disabled
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content (HTML)</label>
                        <p className="mb-2 text-xs text-gray-500">Supports basic HTML tags.</p>
                        <textarea
                            name="content"
                            id="content"
                            rows={15}
                            required
                            value={formData.content}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                        />
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="mb-4 text-lg font-medium text-gray-900">SEO Settings</h3>
                        <div className="grid grid-cols-1 gap-6">
                            {/* Meta Title */}
                            <div>
                                <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700">Meta Title</label>
                                <input
                                    type="text"
                                    name="meta_title"
                                    id="meta_title"
                                    value={formData.meta_title}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                />
                            </div>

                            {/* Meta Description */}
                            <div>
                                <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700">Meta Description</label>
                                <textarea
                                    name="meta_description"
                                    id="meta_description"
                                    rows={3}
                                    value={formData.meta_description}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
