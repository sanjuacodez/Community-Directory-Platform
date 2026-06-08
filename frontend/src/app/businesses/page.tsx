'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Business { id: string; businessName: string; category: string | null; description: string | null; phone: string | null; email: string | null; location: string | null; community: { id: string; name: string }; }

export default function BusinessesPage() {
  const [items, setItems] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api<Business[]>('/businesses').then(setItems).catch(()=>{}).finally(()=>setLoading(false)); }, []);
  if (loading) return <p className="text-zinc-500 p-6">Loading...</p>;
  return (
    <div className="space-y-6"><h1 className="text-2xl font-bold">Business Directory</h1>
      {items.length===0 && <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center"><p className="text-zinc-500">No businesses listed.</p></div>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(b => (
          <Link key={b.id} href={`/businesses/${b.id}`} className="rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-400 transition-colors">
            <h2 className="font-semibold">{b.businessName}</h2>
            {b.category && <p className="text-xs text-zinc-400 mt-1">{b.category}</p>}
            {b.description && <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{b.description}</p>}
            <div className="flex gap-2 mt-2 text-xs text-zinc-400"><span>{b.community.name}</span>{b.location && <><span>·</span><span>{b.location}</span></>}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
