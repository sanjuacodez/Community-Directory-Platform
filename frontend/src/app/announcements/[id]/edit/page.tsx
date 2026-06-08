'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/stores/auth';
import { api } from '@/lib/api';

interface Announcement {
  title: string;
  content: string;
  image: string | null;
}

export default function EditAnnouncementPage() {
  const router = useRouter();
  const params = useParams();
  const { token, user } = useAuth();
  const [form, setForm] = useState({ title: '', content: '', image: '' });
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    api<Announcement>(`/announcements/${params.id}`, { token })
      .then((a) => {
        setForm({ title: a.title, content: a.content, image: a.image ?? '' });
        setInitialLoad(false);
      })
      .catch((err) => setError(err.message));
  }, [token, params.id]);

  if (!user || !user.roles.includes('super_admin')) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center">
        <p className="text-zinc-500">Only super admins can edit announcements.</p>
      </div>
    );
  }
  if (initialLoad) return <p className="text-zinc-500">Loading...</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api(`/announcements/${params.id}`, {
        method: 'PATCH',
        token: token!,
        body: {
          title: form.title,
          content: form.content,
          image: form.image || null,
        },
      });
      router.push('/announcements');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Edit Announcement</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="input" rows={5} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
