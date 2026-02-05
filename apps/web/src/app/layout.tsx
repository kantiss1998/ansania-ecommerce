import type { Metadata } from 'next';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { ToastContainer } from '@/components/ui/Toast';
import { CartDrawer } from '@/components/features/cart/CartDrawer';
import './globals.css';

export const metadata: Metadata = {
    title: {
        default: 'Ansania E-Commerce',
        template: '%s | Ansania',
    },
    description: 'Premium furniture e-commerce with Odoo integration. Temukan furniture minimalis terbaik untuk hunian Anda.',
    keywords: ['furniture', 'meja', 'kursi', 'sofa', 'minimalis', 'ansania', 'odoo ecommerce'],
    authors: [{ name: 'Ansania Team' }],
    openGraph: {
        type: 'website',
        locale: 'id_ID',
        url: 'https://ansania.com',
        siteName: 'Ansania E-Commerce',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id">
            <body className="antialiased" suppressHydrationWarning>
                <QueryProvider>
                    <div className="flex min-h-screen flex-col">
                        <Header />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
                    <MobileNav />
                    <CartDrawer />
                    <ToastContainer />
                </QueryProvider>
            </body>
        </html>
    );
}
