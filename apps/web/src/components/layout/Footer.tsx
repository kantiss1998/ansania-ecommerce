import Link from 'next/link';

/**
 * Footer component with links and information
 */
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-gray-200 bg-white">
            <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
                    {/* Company Info */}
                    <div className="space-y-6">
                        <Link href="/" className="text-2xl font-heading font-bold text-primary-900">
                            Ansania
                        </Link>
                        <p className="text-sm text-gray-600">
                            Premium furniture e-commerce with quality products
                            for your home and office.
                        </p>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="font-heading font-bold text-gray-900">Shop</h3>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li>
                                <Link href="/products" className="text-gray-600 transition hover:text-primary-700">
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories" className="text-gray-600 transition hover:text-primary-700">
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?filter=featured" className="text-gray-600 transition hover:text-primary-700">
                                    Featured Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/flash-sales" className="text-gray-600 transition hover:text-primary-700">
                                    Flash Sales
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="font-heading font-bold text-gray-900">Customer Service</h3>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li>
                                <Link href="/contact-us" className="text-gray-600 transition hover:text-primary-700">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-gray-600 transition hover:text-primary-700">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping-info" className="text-gray-600 transition hover:text-primary-700">
                                    Shipping Info
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns-and-exchanges" className="text-gray-600 transition hover:text-primary-700">
                                    Returns & Exchanges
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Account Links */}
                    <div>
                        <h3 className="font-heading font-bold text-gray-900">Account</h3>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li>
                                <Link href="/profile" className="text-gray-600 transition hover:text-primary-700">
                                    My Profile
                                </Link>
                            </li>
                            <li>
                                <Link href="/orders" className="text-gray-600 transition hover:text-primary-700">
                                    Order History
                                </Link>
                            </li>
                            <li>
                                <Link href="/wishlist" className="text-gray-600 transition hover:text-primary-700">
                                    Wishlist
                                </Link>
                            </li>
                            <li>
                                <Link href="/addresses" className="text-gray-600 transition hover:text-primary-700">
                                    Addresses
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 border-t border-gray-200 pt-8">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-sm text-gray-600">
                            © {currentYear} Ansania. All rights reserved.
                        </p>

                        <div className="flex items-center space-x-6">
                            <Link
                                href="/privacy-policy"
                                className="text-sm text-gray-600 hover:text-blue-600"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms-and-conditions"
                                className="text-sm text-gray-600 hover:text-blue-600"
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
