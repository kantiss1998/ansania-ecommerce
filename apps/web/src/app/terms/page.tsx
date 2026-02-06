import { cmsClient } from '@/lib/cms';
import { notFound } from 'next/navigation';

const PAGE_SLUG = 'terms-and-conditions'; // Slug might be simple 'terms' or full 'terms-and-conditions', FE.md said /terms

export async function generateMetadata() {
    const page = await cmsClient.getPage(PAGE_SLUG);
    if (!page) return { title: 'Page Not Found' };

    return {
        title: `${page.title} - Ansania`,
    };
}

export default async function TermsPage() {
    const page = await cmsClient.getPage(PAGE_SLUG);

    if (!page) {
        // If CMS page not found, maybe show static placeholder or 404
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
                {page.title}
            </h1>

            <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
                <div className="mb-8 border-b pb-4 text-sm text-gray-500">
                    Last updated: {new Date(page.updated_at).toLocaleDateString()}
                </div>
                <div
                    className="prose prose-lg mx-auto text-gray-700 prose-headings:text-primary-800 prose-a:text-primary-700"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </div>
        </div>
    );
}
