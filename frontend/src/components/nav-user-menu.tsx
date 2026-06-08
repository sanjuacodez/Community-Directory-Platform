'use client';

import Link from 'next/link';
import { useAuth } from '@/stores/auth';

export function NavUserMenu() {
  const { user, logout } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-zinc-500">{user.email}</span>
        <button onClick={logout} className="text-red-500 hover:text-red-700">
          Logout
        </button>
      </div>
    );
  }

  return (
    <Link href="/login" className="text-sm text-zinc-900 hover:text-zinc-600 font-medium">
      Login
    </Link>
  );
}
