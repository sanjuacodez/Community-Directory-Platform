'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Item { id: string; title?: string; name?: string; business_name?: string; first_name?: string; last_name?: string; description?: string; content?: string; event_date?: string; date_of_death?: string; published_at?: string; company?: string; location?: string; community?: { name: string }; member?: { first_name: string; last_name: string }; }

function Section({ title, href, items, render }: { title: string; href: string; items: any[]; render: (item: any) => React.ReactNode }) {
  if (!items.length) return null;
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div className="flex items-center justify-between mb-3">
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, margin: 0 }}>{title}</h2>
        <Link href={href} style={{ fontSize: 'var(--font-size-xs)', fontWeight: 500, color: 'var(--color-primary)' }}>View all →</Link>
      </div>
      <div className="space-y-2">{items.map(render)}</div>
    </div>
  );
}

export default function HomePage() {
  const [announcements, setAnn] = useState<Item[]>([]);
  const [events, setEvents] = useState<Item[]>([]);
  const [businesses, setBiz] = useState<Item[]>([]);
  const [jobs, setJobs] = useState<Item[]>([]);
  const [obituaries, setObits] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from('announcements').select('id,title,content,published_at').order('published_at', { ascending: false }).limit(3),
      supabase.from('events').select('id,title,description,event_date,location').order('event_date', { ascending: true }).limit(3),
      supabase.from('businesses').select('id,business_name,category,location').order('created_at', { ascending: false }).limit(3),
      supabase.from('jobs').select('id,title,company,location').order('created_at', { ascending: false }).limit(3),
      supabase.from('obituaries').select('id,content,date_of_death,member:members(first_name,last_name)').order('date_of_death', { ascending: false }).limit(3),
    ]).then(([a, e, b, j, o]) => {
      setAnn((a as any)?.data ?? []); setEvents((e as any)?.data ?? []);
      setBiz((b as any)?.data ?? []); setJobs((j as any)?.data ?? []);
      setObits((o as any)?.data ?? []); setLoaded(true);
    });
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="card" style={{ textAlign: 'center', marginBottom: '2rem', padding: '2.5rem 1.5rem' }}>
        <img src="/logo.svg" alt="" width="52" height="52" style={{ margin: '0 auto 0.75rem' }} />
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, margin: 0 }}>CommunityHub</h1>
        <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-muted)', maxWidth: 480, margin: '0.5rem auto 0' }}>
          Manage families, members, and stay connected with your community.
        </p>
        <div className="flex flex-wrap justify-center gap-2" style={{ marginTop: '1.25rem' }}>
          <Link href="/families" className="btn btn-primary btn-sm">Families</Link>
          <Link href="/members" className="btn btn-outline btn-sm">Members</Link>
          <Link href="/directory" className="btn btn-outline btn-sm">Directory</Link>
        </div>
      </div>

      {!loaded ? <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Section title="📢 Announcements" href="/announcements" items={announcements} render={a => (
            <Link key={a.id} href={`/announcements/${a.id}`} className="block p-2 rounded hover:bg-black/5" style={{ textDecoration: 'none' }}>
              <p style={{ fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>{a.title}</p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: '0.15rem 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.content}</p>
            </Link>
          )} />

          <Section title="📅 Events" href="/events" items={events} render={e => (
            <Link key={e.id} href={`/events/${e.id}`} className="block p-2 rounded hover:bg-black/5" style={{ textDecoration: 'none' }}>
              <div className="flex justify-between"><p style={{ fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>{e.title}</p><span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{e.event_date ? new Date(e.event_date).toLocaleDateString() : ''}</span></div>
              {e.location && <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: 0 }}>{e.location}</p>}
            </Link>
          )} />

          <Section title="🏪 Businesses" href="/businesses" items={businesses} render={b => (
            <Link key={b.id} href={`/businesses/${b.id}`} className="block p-2 rounded hover:bg-black/5" style={{ textDecoration: 'none' }}>
              <p style={{ fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>{b.business_name}</p>
              <div className="flex gap-2" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{b.category && <span>{b.category}</span>}{b.location && <span>· {b.location}</span>}</div>
            </Link>
          )} />

          <Section title="💼 Jobs" href="/jobs" items={jobs} render={j => (
            <Link key={j.id} href={`/jobs/${j.id}`} className="block p-2 rounded hover:bg-black/5" style={{ textDecoration: 'none' }}>
              <p style={{ fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>{j.title}</p>
              <div className="flex gap-2" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{j.company && <span>{j.company}</span>}{j.location && <span>· {j.location}</span>}</div>
            </Link>
          )} />

          <Section title="🕊️ Obituaries" href="/obituaries" items={obituaries} render={o => (
            <Link key={o.id} href={`/obituaries/${o.id}`} className="block p-2 rounded hover:bg-black/5" style={{ textDecoration: 'none' }}>
              <p style={{ fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>{o.member?.first_name} {o.member?.last_name}</p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: 0 }}>{o.date_of_death ? new Date(o.date_of_death).toLocaleDateString() : ''}</p>
            </Link>
          )} />
        </div>
      )}
    </div>
  );
}
