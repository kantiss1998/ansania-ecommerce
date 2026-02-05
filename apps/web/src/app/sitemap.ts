import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://ansania.com'; // Replace with actual domain

    // Static pages
    const routes = [
        '',
        '/products',
        '/about',
        '/contact',
        '/privacy',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    // Mock dynamic product routes (In real app, fetch from API)
    const productRoutes = [
        'kursi-minimalis-modern',
        'sofa-l-shape-premium',
        'meja-kerja-industrial',
    ].map((slug) => ({
        url: `${baseUrl}/products/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 1.0,
    }));

    return [...routes, ...productRoutes];
}
