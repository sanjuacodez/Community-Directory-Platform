'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Business { id: string; businessName: string; category: string | null; description: string | null; phone: string | null; email: string | null; location: string | null; community: { id: string; name: string }; }

export default function BusinessDetailPage() {
  const params = useParams();
  const [b, setB] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api<Business>(`/businesses/${params.id}`).then(setB).catch(()=>{}).finally(()=>setLoading(false)); }, [params.id]);
  if (loading) return <p className="text-zinc-500 p-6">Loading...</p>;
  if (!b) return <p className="text-zinc-500 p-6">Not found.</p>;
  return (
    <div className="mx-auto max-w-2xl space-y-6"><h1 className="text-2xl font-bold">{b.businessName}</h1>
      {b.category && <div className="text-xs text-zinc-400">{b.category} · {b.community.name}</div>}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3">
        {b.description && <p className="text-zinc-700">{b.description}</p>}
        <div className="space-y-1 text-sm">
          {b.phone && <p><span className="text-zinc-500">Phone: </span>{b.phone}</p>}
          {b.email && <p><span className="text-zinc-500">Email: </span>{b.email}</p>}
          {b.location && <p><span className="text-zinc-500">Location: </span>{b.location}</p>}
        </div>
      </div>
      <Link href="/businesses" className="text-sm text-zinc-500 hover:text-zinc-700">← Back to directory</Link>
    </div>
  );
}
