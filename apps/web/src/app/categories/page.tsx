import { categoryService } from '@/services/categoryService';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
    const categories = await categoryService.getCategories();

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
                        Koleksi Kami
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Pilih kategori favorit Anda untuk menemukan furnitur impian
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="group relative flex aspect-[4/3] flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="relative flex-1 overflow-hidden">
                                <Image
                                    src={category.image || '/placeholder-category.svg'}
                                    alt={category.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h2 className="text-2xl font-bold">{category.name}</h2>
                                {category.description && (
                                    <p className="mt-1 line-clamp-2 text-sm text-gray-200">
                                        {category.description}
                                    </p>
                                )}
                                <div className="mt-4 flex items-center text-sm font-semibold text-white/90">
                                    Lihat Produk
                                    <svg
                                        className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="py-24 text-center">
                        <p className="text-xl text-gray-500 italic">Belum ada kategori yang tersedia.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
