'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Event {
  id: string; title: string; description: string | null; eventDate: string; location: string | null; image: string | null;
  community: { id: string; name: string };
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api<Event[]>('/events').then(setEvents).catch(()=>{}).finally(()=>setLoading(false)); }, []);
  if (loading) return <p className="text-zinc-500 p-6">Loading...</p>;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Events</h1>
      {events.length===0 && <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center"><p className="text-zinc-500">No events yet.</p></div>}
      <div className="space-y-4">
        {events.map(e => (
          <Link key={e.id} href={`/events/${e.id}`} className="block rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-400 transition-colors">
            <div className="flex gap-4">
              {e.image && <img src={e.image} className="w-20 h-20 rounded-lg object-cover" />}
              <div className="flex-1">
                <h2 className="font-semibold">{e.title}</h2>
                <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{e.description}</p>
                <div className="flex gap-2 mt-2 text-xs text-zinc-400">
                  <span>{new Date(e.eventDate).toLocaleDateString()}</span>
                  {e.location && <><span>·</span><span>{e.location}</span></>}
                  <span>·</span><span>{e.community.name}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
