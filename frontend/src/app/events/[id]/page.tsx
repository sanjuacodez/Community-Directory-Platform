'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Event { id: string; title: string; description: string | null; eventDate: string; location: string | null; image: string | null; community: { id: string; name: string }; }

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api<Event>(`/events/${params.id}`).then(setEvent).catch(()=>{}).finally(()=>setLoading(false)); }, [params.id]);
  if (loading) return <p className="text-zinc-500 p-6">Loading...</p>;
  if (!event) return <p className="text-zinc-500 p-6">Not found.</p>;
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <div className="text-xs text-zinc-400 flex gap-2"><span>{new Date(event.eventDate).toLocaleDateString()}</span>{event.location && <><span>·</span><span>{event.location}</span></>}<span>·</span><span>{event.community.name}</span></div>
      {event.image && <img src={event.image} className="w-full rounded-xl object-cover max-h-96" />}
      {event.description && <div className="rounded-xl border border-zinc-200 bg-white p-6"><p className="text-zinc-700 whitespace-pre-wrap">{event.description}</p></div>}
      <Link href="/events" className="text-sm text-zinc-500 hover:text-zinc-700">← Back to events</Link>
    </div>
  );
}
