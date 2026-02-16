import Link from 'next/link';
import { Building2, Package, ArrowRight, ClipboardList } from 'lucide-react';

export default function Home() {
    return (
        <div className="space-y-6">
            <div className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Dashboard
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* DA5 Card */}
                <div className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
                    <div className="flex-shrink-0">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                            <ClipboardList className="h-6 w-6 text-indigo-700" aria-hidden="true" />
                        </span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <Link href="/sparta" className="focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true" />
                            <p className="text-sm font-medium text-gray-900">DA5</p>
                            <p className="truncate text-sm text-gray-500">SPARTA - Sistem Pendaftaran Aset</p>
                        </Link>
                    </div>
                    <div className="flex-shrink-0">
                        <ArrowRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                </div>

                {/* Assets Card */}
                <div className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:border-gray-400">
                    <div className="flex-shrink-0">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                            <Package className="h-6 w-6 text-blue-700" aria-hidden="true" />
                        </span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <Link href="/assets" className="focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true" />
                            <p className="text-sm font-medium text-gray-900">Manage Assets</p>
                            <p className="truncate text-sm text-gray-500">View and update inventory</p>
                        </Link>
                    </div>
                    <div className="flex-shrink-0">
                        <ArrowRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                </div>

                {/* Buildings Card */}
                <div className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:border-gray-400">
                    <div className="flex-shrink-0">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                            <Building2 className="h-6 w-6 text-indigo-700" aria-hidden="true" />
                        </span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <Link href="/buildings" className="focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true" />
                            <p className="text-sm font-medium text-gray-900">Manage Buildings</p>
                            <p className="truncate text-sm text-gray-500">Locations and facilities</p>
                        </Link>
                    </div>
                    <div className="flex-shrink-0">
                        <ArrowRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                </div>
            </div>

            <div className="rounded-lg bg-white shadow">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">Welcome to Asset Manager</h3>
                    <div className="mt-2 text-sm text-gray-500">
                        <p>
                            Select an option above to get started. You can track assets, manage building information, and generate reports from this system.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
