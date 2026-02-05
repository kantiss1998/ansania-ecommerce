import Link from 'next/link';

/**
 * Footer component with links and information
 */
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-gray-200 bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-primary-700">
                            Ansania
                        </h3>
                        <p className="text-sm text-gray-600">
                            Premium furniture e-commerce with quality products
                            for your home and office.
                        </p>
                    </div>

                    {/* Shop Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Shop</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/products"
                                    className="text-gray-600 hover:text-primary-700"
                                >
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/categories"
                                    className="text-gray-600 hover:text-primary-700"
                                >
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products?filter=featured"
                                    className="text-gray-600 hover:text-primary-700"
                                >
                                    Featured Products
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/flash-sales"
                                    className="text-gray-600 hover:text-primary-700"
                                >
                                    Flash Sales
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">
                            Customer Service
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-gray-600 hover:text-primary-700"
                                >
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/faq"
                                    className="text-gray-600 hover:text-primary-700"
                                >
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/shipping"
                                    className="text-gray-600 hover:text-primary-700"
                                >
                                    Shipping Info
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/returns"
                                    className="text-gray-600 hover:text-primary-700"
                                >
                                    Returns & Exchanges
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Account Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Account</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/profile"
                                    className="text-gray-600 hover:text-primary-700"
                                >
                                    My Profile
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/orders"
                                    className="text-gray-600 hover:text-primary-700"
                                >
                                    Order History
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/wishlist"
                                    className="text-gray-600 hover:text-primary-700"
                                >
                                    Wishlist
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/addresses"
                                    className="text-gray-600 hover:text-primary-700"
                                >
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
                                href="/privacy"
                                className="text-sm text-gray-600 hover:text-blue-600"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms"
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
