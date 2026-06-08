'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Announcement {
  id: string;
  title: string;
  content: string;
  image: string | null;
  publishedAt: string;
  community: { id: string; name: string };
}

export default function AnnouncementDetailPage() {
  const params = useParams();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Announcement>(`/announcements/${params.id}`)
      .then((data) => {
        setAnnouncement(data);
        setError('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <p className="text-zinc-500 p-6">Loading...</p>;
  if (error) return <p className="text-red-600 p-6">{error}</p>;
  if (!announcement) return <p className="text-zinc-500 p-6">Not found.</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">{announcement.title}</h1>

      <div className="text-xs text-zinc-400 flex gap-2">
        <span>{announcement.community.name}</span>
        <span>·</span>
        <span>{new Date(announcement.publishedAt).toLocaleDateString()}</span>
      </div>

      {announcement.image && (
        <img
          src={announcement.image}
          alt={announcement.title}
          className="w-full rounded-xl object-cover max-h-96"
        />
      )}

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <p className="text-zinc-700 whitespace-pre-wrap">{announcement.content}</p>
      </div>

      <Link href="/announcements" className="text-sm text-zinc-500 hover:text-zinc-700">
        ← Back to announcements
      </Link>
    </div>
  );
}
