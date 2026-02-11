import { notFound } from 'next/navigation';

import { cmsClient } from '@/lib/cms';

const PAGE_SLUG = 'faq';
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const page = await cmsClient.getPage(PAGE_SLUG);
    if (!page) return { title: 'Page Not Found' };

    return {
        title: `${page.title} - Ansania`,
    };
}

export default async function FAQPage() {
    const page = await cmsClient.getPage(PAGE_SLUG);

    if (!page) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Header */}
            <div className="bg-primary-700 py-16 text-center text-white">
                <div className="container mx-auto px-4">
                    <h1 className="mb-4 text-4xl font-bold">{page.title}</h1>
                    <p className="mx-auto max-w-2xl text-primary-100 text-lg">
                        Have questions? We&apos;re here to help. Browse our frequently asked questions below.
                    </p>
                    {/* Placeholder for Search Input */}
                    <div className="mx-auto mt-8 max-w-md">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for answers..."
                                className="w-full rounded-full border-none py-3 pl-12 pr-4 text-gray-900 shadow-md focus:ring-2 focus:ring-secondary"
                                readOnly
                            />
                            <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Content using Prose but styled for FAQ */}
            <div className="container mx-auto -mt-8 px-4 pb-20">
                <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-md sm:p-12">
                    <div className="mb-8 flex items-center justify-between border-b pb-4">
                        <span className="text-sm text-gray-500">
                            Last updated: {new Date(page.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>

                    <article
                        className="prose prose-lg max-w-none 
                        prose-headings:font-bold prose-headings:text-gray-900
                        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-6 prose-h2:border-b prose-h2:pb-2
                        prose-h3:text-xl prose-h3:text-primary-700 prose-h3:mt-8
                        prose-p:text-gray-600 prose-p:leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                </div>
            </div>
        </div>
    );
}
