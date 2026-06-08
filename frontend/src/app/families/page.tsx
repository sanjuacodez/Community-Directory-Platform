'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/stores/auth';
import { api } from '@/lib/api';

interface Community {
  id: string;
  name: string;
}

interface Family {
  id: string;
  name: string;
  houseName: string | null;
  address: string | null;
  status: string;
  community: Community;
  _count: { members: number };
}

export default function FamiliesPage() {
  const { token, user } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      api<Community[]>('/communities', { token })
        .then(setCommunities)
        .catch(() => {});
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const params = selectedCommunity
      ? `?communityId=${selectedCommunity}`
      : '';
    api<Family[]>(`/families${params}`, { token })
      .then((data) => {
        setFamilies(data);
        setError('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, selectedCommunity]);

  const handleDelete = async (id: string) => {
    if (!confirm('Archive this family?')) return;
    try {
      await api(`/families/${id}`, { method: 'DELETE', token: token! });
      setFamilies((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: 'deleted' } : f)),
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  if (!user) {
    return (
      <div className="space-y-4">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Families</h1>
        <Link
          href="/families/create"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
        >
          Add Family
        </Link>
      </div>

      <div>
        <select
          value={selectedCommunity}
          onChange={(e) => setSelectedCommunity(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">All Communities</option>
          {communities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-zinc-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-3">
        {families.map((family) => (
          <div
            key={family.id}
            className="rounded-xl border border-zinc-200 bg-white p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold">{family.name}</h2>
                <p className="text-sm text-zinc-500">
                  {family.houseName && `${family.houseName} · `}
                  {family.community.name}
                </p>
                <p className="text-xs text-zinc-400">
                  {family._count.members} member(s) ·{' '}
                  {family.status === 'active' ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-red-500">{family.status}</span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/families/${family.id}/edit`}
                  className="text-sm text-zinc-600 hover:text-zinc-900"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(family.id)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Archive
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && families.length === 0 && (
          <p className="text-zinc-500">No families found.</p>
        )}
      </div>
    </div>
  );
}

function LoginForm() {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123456');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Auth failed');
    }
  };

  return (
    <div className="mx-auto max-w-sm rounded-xl border border-zinc-200 bg-white p-6">
      <h2 className="text-lg font-semibold">
        {mode === 'login' ? 'Login' : 'Register'}
      </h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
        >
          {mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
      <button
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        className="mt-3 text-sm text-zinc-500 hover:text-zinc-700"
      >
        {mode === 'login'
          ? 'Need an account? Register'
          : 'Have an account? Login'}
      </button>
    </div>
  );
}
