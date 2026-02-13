import Link from 'next/link';
import { Building2, LayoutDashboard, Package } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex">
                        <div className="flex flex-shrink-0 items-center">
                            <Building2 className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">AssetManager</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                href="/"
                                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            >
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Dashboard
                            </Link>
                            <Link
                                href="/assets"
                                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            >
                                <Package className="mr-2 h-4 w-4" />
                                Assets
                            </Link>
                            <Link
                                href="/buildings"
                                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            >
                                <Building2 className="mr-2 h-4 w-4" />
                                Buildings
                            </Link>
                        </div>
                    </div>
                    {/* Mobile menu button could go here */}
                </div>
            </div>
        </nav>
    );
}
