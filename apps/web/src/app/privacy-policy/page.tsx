import { cmsClient } from '@/lib/cms';
import { notFound } from 'next/navigation';
import { CmsContent } from '@/components/features/cms/CmsContent';

const PAGE_SLUG = 'privacy-policy';

export async function generateMetadata() {
    const page = await cmsClient.getPage(PAGE_SLUG);
    if (!page) return { title: 'Page Not Found' };

    return {
        title: `${page.title} - Ansania`,
    };
}

export default async function PrivacyPage() {
    const page = await cmsClient.getPage(PAGE_SLUG);

    if (!page) {
        notFound();
    }

    return <CmsContent page={page} />;
}
