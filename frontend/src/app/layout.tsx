import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Community Directory Platform',
  description: 'Manage families, members, relationships, and more',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased">
        <nav className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-bold text-zinc-900">
              Community Directory
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/businesses" className="hover:text-zinc-600">Businesses</Link>
              <Link href="/events" className="hover:text-zinc-600">
                Events
              </Link>
              <Link href="/announcements" className="hover:text-zinc-600">
                News
              </Link>
              <Link href="/families" className="hover:text-zinc-600">
                Families
              </Link>
              <Link href="/members" className="hover:text-zinc-600">
                Members
              </Link>
              <Link href="/directory" className="hover:text-zinc-600">
                Directory
              </Link>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
