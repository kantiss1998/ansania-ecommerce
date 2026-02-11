import { notFound } from 'next/navigation';

import { CmsContent } from '@/components/features/cms/CmsContent';
import { cmsClient } from '@/lib/cms';

const PAGE_SLUG = 'terms-and-conditions';
export const dynamic = 'force-dynamic';

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
        notFound();
    }

    return <CmsContent page={page} />;
}
