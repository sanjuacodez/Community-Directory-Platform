'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/stores/auth';
import { api } from '@/lib/api';

interface Community {
  id: string;
  name: string;
}

export default function CreateFamilyPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [communityId, setCommunityId] = useState('');
  const [name, setName] = useState('');
  const [houseName, setHouseName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      api<Community[]>('/communities', { token }).then(setCommunities).catch(() => {});
    }
  }, [token]);

  if (!user) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <p>Please login to create families.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api('/families', {
        method: 'POST',
        token: token!,
        body: { communityId, name, houseName: houseName || undefined, address: address || undefined },
      });
      router.push('/families');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create family');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Create Family</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <div>
          <label className="block text-sm font-medium">Community</label>
          <select
            value={communityId}
            onChange={(e) => setCommunityId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            required
          >
            <option value="">Select community</option>
            {communities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Family Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            required
            minLength={2}
            maxLength={100}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">House Name (optional)</label>
          <input
            type="text"
            value={houseName}
            onChange={(e) => setHouseName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            maxLength={100}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Address (optional)</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            maxLength={500}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Family'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
