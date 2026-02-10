import type { Metadata } from 'next';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ToastContainer } from '@/components/ui/Toast';
import './globals.css';
import { Outfit, Inter } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body' });

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
        <html lang="id" className={`${outfit.variable} ${inter.variable}`}>
            <body className="font-body antialiased text-gray-800 bg-gray-50 selection:bg-primary-100 selection:text-primary-900" suppressHydrationWarning>
                <QueryProvider>
                    {children}
                    <ToastContainer />
                </QueryProvider>
            </body>
        </html>
    );
}
