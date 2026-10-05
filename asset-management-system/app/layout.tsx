import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { ToastProvider } from '@/components/ui';

export const metadata: Metadata = {
  title: {
    default: 'SPARTA DBKL | Asset Management System',
    template: '%s | SPARTA DBKL',
  },
  description: 'Sistem Pendaftaran Aset Rol Tak Alih - Track and manage government building assets for Dewan Bandaraya Kuala Lumpur',
  keywords: ['asset management', 'DBKL', 'government', 'SPARTA', 'building management', 'asset tracking'],
  authors: [{ name: 'DBKL' }],
  creator: 'Dewan Bandaraya Kuala Lumpur',
  publisher: 'Dewan Bandaraya Kuala Lumpur',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_MY',
    url: 'https://sparta.dbkl.gov.my',
    siteName: 'SPARTA DBKL',
    title: 'SPARTA DBKL - Asset Management System',
    description: 'Sistem Pendaftaran Aset Rol Tak Alih - Government Asset Management System',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1e6c93',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 w-full">
              <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
            <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-auto">
              <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Dewan Bandaraya Kuala Lumpur. All rights reserved.</p>
                  </div>
                  <div className="text-sm text-gray-400">
                    <p>SPARTA Version 2.0 | Sistem Pendaftaran Aset Rol Tak Alih</p>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
