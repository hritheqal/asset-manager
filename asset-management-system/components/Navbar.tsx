'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Building2, ClipboardList, User, LogOut, Menu, X, Search } from 'lucide-react';

interface UserData {
    email: string;
    fullName: string;
}

const navigation = [
    { name: 'SPARTA', href: '/spartav2', icon: ClipboardList },
];

const searchOptions = [
    { value: 'assets', label: 'Assets', href: '/assets?search=' },
    { value: 'buildings', label: 'Buildings', href: '/buildings?search=' },
    { value: 'da5', label: 'DA5 Records', href: '/sparta?tab=da5' },
    { value: 'da6', label: 'DA6 Records', href: '/sparta?tab=da6' },
];

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('assets');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();
                if (authUser) {
                    setUser({
                        email: authUser.email || '',
                        fullName: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
                    });
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUser({
                    email: session.user.email || '',
                    fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            router.push('/auth/login');
            router.refresh();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        
        const selectedOption = searchOptions.find(opt => opt.value === searchType);
        if (selectedOption) {
            router.push(`${selectedOption.href}${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setIsSearchOpen(false);
        }
    };

    // Close search when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.search-dropdown')) {
                setIsSearchOpen(false);
            }
        };
        
        if (isSearchOpen) {
            document.addEventListener('click', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isSearchOpen]);

    if (!user) {
        return null;
    }

    return (
        <nav className="border-b border-gray-200 bg-white shadow-sm" role="navigation" aria-label="Main navigation">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex">
                        <Link href="/" className="flex flex-shrink-0 items-center">
                            <Building2 className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">SPARTA DBKL</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${
                                            isActive 
                                                ? 'border-blue-500 text-gray-900' 
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                        aria-current={isActive ? 'page' : undefined}
                                    >
                                        <Icon className="mr-2 h-4 w-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                            
                            {/* Global Search */}
                            <div className="relative search-dropdown">
                                <button
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    <Search className="h-4 w-4 mr-1" />
                                    Search
                                </button>
                                
                                {isSearchOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                                        <form onSubmit={handleSearch}>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Search Type</label>
                                                    <select
                                                        value={searchType}
                                                        onChange={(e) => setSearchType(e.target.value)}
                                                        className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
                                                    >
                                                        {searchOptions.map((opt) => (
                                                            <option key={opt.value} value={opt.value}>
                                                                {opt.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
                                                    <input
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        placeholder="Enter search term..."
                                                        className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
                                                        autoFocus
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                                                >
                                                    Search
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="hidden sm:flex sm:items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="h-4 w-4" />
                            <span>{user.fullName}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>

                    <div className="flex items-center sm:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="sm:hidden border-t border-gray-200">
                    <div className="space-y-1 px-4 pb-3 pt-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                                        isActive 
                                            ? 'bg-blue-50 text-blue-700' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                        <div className="border-t border-gray-200 pt-3 mt-3">
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    handleLogout();
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-base font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                            >
                                <LogOut className="h-5 w-5" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
