import type { Metadata } from 'next';
import { AuthProvider } from '@/components/auth-provider';
import { Nav } from '@/components/nav';
import './globals.css';

export const metadata: Metadata = {
  title: 'CommunityHub - Directory Platform',
  description: 'Manage families, members, relationships, and community activities',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Nav />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
