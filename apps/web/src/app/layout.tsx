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

import { Outfit, Inter } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body' });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id" className={`${outfit.variable} ${inter.variable}`}>
            <body className="font-body antialiased text-gray-800 bg-gray-50 selection:bg-primary-100 selection:text-primary-900" suppressHydrationWarning>
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
