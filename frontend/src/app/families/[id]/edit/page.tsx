'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/stores/auth';
import { api } from '@/lib/api';

interface Community {
  id: string;
  name: string;
}

interface Family {
  id: string;
  communityId: string;
  name: string;
  houseName: string | null;
  address: string | null;
}

export default function EditFamilyPage() {
  const router = useRouter();
  const params = useParams();
  const { token, user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [name, setName] = useState('');
  const [houseName, setHouseName] = useState('');
  const [address, setAddress] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    api<Family>(`/families/${params.id}`, { token })
      .then((family) => {
        setName(family.name);
        setHouseName(family.houseName ?? '');
        setAddress(family.address ?? '');
        setInitialLoad(false);
      })
      .catch((err) => setError(err.message));

    api<Community[]>('/communities', { token })
      .then(setCommunities)
      .catch(() => {});
  }, [token, params.id]);

  if (!user) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <p>Please login to edit families.</p>
      </div>
    );
  }

  if (initialLoad) {
    return <p className="text-zinc-500">Loading...</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body: Record<string, string | null> = {};
      if (name) body.name = name;
      body.houseName = houseName || null;
      body.address = address || null;

      await api(`/families/${params.id}`, {
        method: 'PATCH',
        token: token!,
        body,
      });
      router.push('/families');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update family');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Edit Family</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
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
          <label className="block text-sm font-medium">House Name</label>
          <input
            type="text"
            value={houseName}
            onChange={(e) => setHouseName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            maxLength={100}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Address</label>
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
            {loading ? 'Saving...' : 'Save Changes'}
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
