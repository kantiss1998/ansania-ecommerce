import { cmsClient } from '@/lib/cms';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Ignore common static file requests
    if (slug.includes('.') || slug === 'favicon.ico' || slug.includes('apple-touch-icon')) return { title: 'Not Found' };

    const page = await cmsClient.getPage(slug);
    if (!page) return { title: 'Page Not Found' };

    return {
        title: `${page.title} - Ansania`,
    };
}

export default async function CMSPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Ignore common static file requests and return 404 immediately
    if (slug.includes('.') || slug === 'favicon.ico' || slug.includes('apple-touch-icon')) {
        notFound();
    }

    const page = await cmsClient.getPage(slug);

    if (!page) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-sm">
                <h1 className="mb-4 text-3xl font-bold text-gray-900">{page.title}</h1>
                <p className="mb-8 text-sm text-gray-500">
                    Dipublikasikan pada: {page.publishedAt ? new Date(page.publishedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    }) : '-'}
                </p>
                <div
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </div>
        </div>
    );
}
