'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Building2, LayoutDashboard, Package, ClipboardList, User } from 'lucide-react';

interface UserData {
    email: string;
    fullName: string;
}

export default function Navbar() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

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

        // Listen for auth state changes
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

        // Cleanup subscription on unmount
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

    // Don't show navbar if user is not logged in
    if (!user) {
        return null;
    }

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
                            <Link
                                href="/sparta"
                                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            >
                                <ClipboardList className="mr-2 h-4 w-4" />
                                SPARTA
                            </Link>
                        </div>
                    </div>

                    {/* User Section - Right Side */}
                    <div className="flex items-center">
                        <button
                            onClick={handleLogout}
                            className="group inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-xs font-medium rounded-full shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 hover:scale-102 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-out"
                        >
                            <div className="flex items-center justify-center w-5 h-5 mr-2 bg-white/20 rounded-full backdrop-blur-sm">
                                <User className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-white">{user.fullName}</span>
                            <span className="mx-2 h-3 w-px bg-blue-400/50"></span>
                            <span className="text-red-200 group-hover:text-red-100 transition-colors">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
