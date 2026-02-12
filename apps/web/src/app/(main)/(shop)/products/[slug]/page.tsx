import { Metadata } from "next";

import { ProductDetailView } from "@/components/features/product/ProductDetailView";
import { productService, Product } from "@/services/productService";

export const dynamic = "force-dynamic";

// Helper to fetch product data
async function getProduct(slug: string): Promise<Product> {
  const product = await productService.getProductBySlug(slug);

  // If reviews are not part of the detail call, fetch them separately
  if (!product.reviews || product.reviews.length === 0) {
    const reviews = await productService.getReviews(product.id);
    product.reviews = reviews;
  }

  return product;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  return {
    title: `${product.name} | Ansania`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.map((img) => img.image_url) || [
        product.thumbnail_url || "",
      ],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  return <ProductDetailView product={product} />;
}
