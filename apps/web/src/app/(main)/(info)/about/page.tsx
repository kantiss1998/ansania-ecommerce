import { cmsClient } from '@/lib/cms';
import { notFound } from 'next/navigation';

const PAGE_SLUG = 'about';
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const page = await cmsClient.getPage(PAGE_SLUG);
    if (!page) return { title: 'Page Not Found' };

    return {
        title: `${page.title} - Ansania`,
    };
}

export default async function AboutPage() {
    const page = await cmsClient.getPage(PAGE_SLUG);

    if (!page) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
                {page.title}
            </h1>

            <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
                <div
                    className="prose prose-lg mx-auto text-gray-700 prose-headings:text-primary-800 prose-a:text-primary-700"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </div>
        </div>
    );
}
