import { cmsClient } from '@/lib/cms';
import { notFound } from 'next/navigation';
import { ContactForm } from '@/components/features/contact/ContactForm';

const PAGE_SLUG = 'contact-us';
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const page = await cmsClient.getPage(PAGE_SLUG);
    if (!page) return { title: 'Page Not Found' };

    return {
        title: `${page.title} - Ansania`,
    };
}

export default async function ContactPage() {
    const page = await cmsClient.getPage(PAGE_SLUG);

    if (!page) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
                {page.title}
            </h1>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                {/* Left Column: CMS Content (Address, Info) */}
                <div className="rounded-2xl bg-gray-50 p-8 shadow-sm">
                    <div
                        className="prose prose-lg text-gray-700 prose-headings:text-primary-800 prose-a:text-primary-700"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                </div>

                {/* Right Column: Contact Form */}
                <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-100">
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">
                        Send us a Message
                    </h2>
                    <ContactForm />
                </div>
            </div>
        </div>
    );
}
