import { flashSaleService } from '@/services/flashSaleService';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default async function FlashSalesPage() {
    const flashSales = await flashSaleService.getActiveFlashSales();

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="mb-12 rounded-3xl bg-gradient-to-br from-error-600 to-primary-900 p-8 text-white md:p-16 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <Badge variant="error" className="bg-white text-error-600 mb-4 animate-pulse">Sedang Berlangsung</Badge>
                        <h1 className="text-4xl font-black md:text-6xl tracking-tight">
                            Flash Sale <span className="text-yellow-400">Ansania</span>
                        </h1>
                        <p className="mt-6 text-xl text-primary-100/90 font-medium">
                            Dapatkan penawaran terbatas dengan harga terbaik untuk furnitur pilihan. Jangan sampai kehabisan!
                        </p>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-0 left-0 -ml-10 -mb-10 h-40 w-40 rounded-full bg-yellow-400/20 blur-2xl" />
                </div>

                <div className="space-y-12">
                    {flashSales.length > 0 ? (
                        flashSales.map((sale) => (
                            <section key={sale.id} className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100 overflow-hidden">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-6">
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">{sale.name}</h2>
                                        <p className="text-gray-500 mt-1">{sale.description}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="text-sm font-bold text-error-600 bg-error-50 px-4 py-2 rounded-full uppercase tracking-widest">Berakhir Pada:</div>
                                        <div className="text-2xl font-black text-gray-900 mt-1">
                                            {new Date(sale.end_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                    {sale.products.map((item) => {
                                        const discount = Math.round(((item.original_price - item.flash_sale_price) / item.original_price) * 100);
                                        const soldPercentage = Math.round((item.sold / item.stock) * 100);

                                        return (
                                            <Link
                                                key={item.id}
                                                href={`/products/${item.product.slug}`}
                                                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:border-primary-200 hover:shadow-xl"
                                            >
                                                <div className="relative aspect-square overflow-hidden bg-gray-50">
                                                    <Image
                                                        src={item.product.thumbnail_url || '/placeholder-product.svg'}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute top-3 left-3">
                                                        <Badge variant="error" className="px-3 py-1 text-sm font-bold shadow-lg">-{discount}%</Badge>
                                                    </div>
                                                </div>
                                                <div className="flex flex-1 flex-col p-5">
                                                    <h3 className="line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{item.product.name}</h3>
                                                    <div className="mt-4 flex flex-col gap-1">
                                                        <span className="text-lg font-black text-error-600">{formatCurrency(item.flash_sale_price)}</span>
                                                        <span className="text-xs text-gray-400 line-through">{formatCurrency(item.original_price)}</span>
                                                    </div>

                                                    {/* Progress bar */}
                                                    <div className="mt-6 space-y-2">
                                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                                            <span>Terjual {item.sold}</span>
                                                            <span>Sisa {item.stock - item.sold}</span>
                                                        </div>
                                                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                                            <div
                                                                className={`h-full transition-all duration-1000 ${soldPercentage > 80 ? 'bg-error-500' : 'bg-primary-600'}`}
                                                                style={{ width: `${soldPercentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        ))
                    ) : (
                        <div className="py-24 text-center rounded-3xl border-2 border-dashed border-gray-200 bg-white">
                            <div className="mx-auto h-20 w-20 text-gray-200 mb-6">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Belum Ada Flash Sale</h2>
                            <p className="mt-2 text-gray-500">Nantikan penawaran menarik kami selanjutnya!</p>
                            <Link href="/products">
                                <Button variant="outline" size="md" className="mt-8">Lihat Semua Produk</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
