import React from 'react';

import { CMSPage } from '@/services/cmsService';

interface CmsContentProps {
    page: CMSPage;
}

export function CmsContent({ page }: CmsContentProps) {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
                    {/* Header Section */}
                    <div className="border-b border-gray-100 bg-white px-8 py-10 text-center sm:px-12">
                        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            {page.title}
                        </h1>
                        <p className="text-sm font-medium text-gray-500">
                            Effective Date: {page.publishedAt ? new Date(page.publishedAt).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            }) : '-'}
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="px-8 py-10 sm:px-12">
                        <article
                            className="prose prose-lg max-w-none text-gray-600
                            prose-headings:font-heading prose-headings:font-bold prose-headings:text-gray-900
                            prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-gray-900
                            prose-ul:list-disc prose-ul:pl-6
                            prose-li:marker:text-gray-400"
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
