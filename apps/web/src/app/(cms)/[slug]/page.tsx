import { cmsClient } from '@/lib/cms';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await cmsClient.getPage(slug);
    if (!page) return { title: 'Page Not Found' };

    return {
        title: `${page.title} - Ansania`,
    };
}

export default async function CMSPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await cmsClient.getPage(slug);

    if (!page) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-sm">
                <h1 className="mb-4 text-3xl font-bold text-gray-900">{page.title}</h1>
                <p className="mb-8 text-sm text-gray-500">
                    Dipublikasikan pada: {new Date(page.publishedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })}
                </p>
                <div className="prose max-w-none text-gray-700">
                    {/* Basic Markdown rendering simulation */}
                    {page.content.split('\n').map((line, index) => {
                        if (line.startsWith('# ')) return <h1 key={index} className="mb-4 mt-6 text-2xl font-bold">{line.replace('# ', '')}</h1>;
                        if (line.startsWith('## ')) return <h2 key={index} className="mb-3 mt-5 text-xl font-bold">{line.replace('## ', '')}</h2>;
                        if (line.trim() === '') return <br key={index} />;
                        if (line.startsWith('- ')) return <li key={index} className="ml-4 list-disc">{line.replace('- ', '')}</li>;
                        return <p key={index} className="mb-2">{line}</p>;
                    })}
                </div>
            </div>
        </div>
    );
}
