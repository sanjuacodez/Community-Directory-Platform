'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/stores/auth';

const links = [
  { href: '/', label: 'Home' },
  { href: '/communities', label: 'Communities' },
  { href: '/families', label: 'Families' },
  { href: '/members', label: 'Members' },
  { href: '/directory', label: 'Directory' },
  { href: '/announcements', label: 'News' },
  { href: '/events', label: 'Events' },
  { href: '/businesses', label: 'Business' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/obituaries', label: 'Obituaries' },
];

export function Nav() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav style={{ background: 'var(--color-surface)', borderBottom: '2px solid var(--color-border)' }}>
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold no-underline" style={{ color: 'var(--color-primary)' }}>
          <img src="/logo.svg" alt="" width="32" height="32" className="flex-shrink-0" />
          <span className="hidden sm:inline">CommunityHub</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1 flex-wrap">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="px-2 py-1.5 rounded text-sm font-medium hover:bg-black/5 transition-colors" style={{ color: 'var(--color-text)' }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden btn btn-ghost btn-sm"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
        </button>

        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{user.email}</span>
              <Link href="/dashboard" className="btn btn-outline btn-sm">Dashboard</Link>
              <button onClick={logout} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }}>Logout</button>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">Login</Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t px-4 py-3 space-y-1" style={{ borderColor: 'var(--color-border)' }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block px-3 py-2 rounded text-base font-medium hover:bg-black/5">
              {l.label}
            </Link>
          ))}
          <div className="border-t pt-3 mt-2" style={{ borderColor: 'var(--color-border)' }}>
            {user ? (
              <>
                <p className="px-3 text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>{user.email}</p>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="block px-3 py-2 rounded text-base font-medium hover:bg-black/5">Dashboard</Link>
                <button onClick={() => { logout(); setOpen(false); }} className="block w-full text-left px-3 py-2 rounded text-base font-medium hover:bg-black/5" style={{ color: 'var(--color-danger)' }}>Logout</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} className="block px-3 py-2 rounded text-base font-medium btn btn-primary">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
