import { Metadata } from 'next';
import { ProductDetailView, ProductDetailData } from '@/components/features/product/ProductDetailView';
import { productService } from '@/services/productService';

// Helper to fetch product data (simulating API)
async function getProduct(slug: string): Promise<ProductDetailData> {
    const product = await productService.getProductBySlug(slug);

    // Map API product to ProductDetailData if structure differs slightly,
    // or ensure ProductDetailData matches API response.
    // For now, assuming relatively compatible structure but ensuring mandatory fields.
    // Also, filling in missing fields like variants/reviews if better suited for separate calls, 
    // but here assuming they come with product detail or defaulting.

    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        base_price: product.base_price,
        discount_price: product.discount_price,
        images: product.images || [product.thumbnail_url || ''],
        rating_average: product.rating_average,
        total_reviews: product.total_reviews,
        is_featured: product.is_featured,
        is_new: product.is_new,
        category: product.category?.name || 'Uncategorized',
        variants: product.variants || [],
        reviews: [], // Fetch reviews separately if needed, or if included in response
        related_products: product.related_products || [], // Map related products
    };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    return {
        title: `${product.name} | Ansania`,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            images: product.images,
        },
    };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    return <ProductDetailView product={product} />;
}
