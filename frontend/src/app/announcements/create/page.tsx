'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/stores/auth';
import { api } from '@/lib/api';

interface Community {
  id: string;
  name: string;
}

export default function CreateAnnouncementPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [communityId, setCommunityId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      api<Community[]>('/communities', { token }).then(setCommunities).catch(() => {});
    }
  }, [token]);

  if (!user || !user.roles.includes('super_admin')) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center">
        <p className="text-zinc-500">Only super admins can manage announcements.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api('/announcements', {
        method: 'POST',
        token: token!,
        body: {
          communityId,
          title,
          content,
          image: image || undefined,
        },
      });
      router.push('/announcements');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Create failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">New Announcement</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <div>
          <label className="block text-sm font-medium">Community</label>
          <select value={communityId} onChange={(e) => setCommunityId(e.target.value)} className="input" required>
            <option value="">Select community</option>
            {communities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input" required minLength={2} maxLength={200} />
        </div>
        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} className="input" rows={5} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Image URL (optional)</label>
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="input" placeholder="https://..." />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : 'Create'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
