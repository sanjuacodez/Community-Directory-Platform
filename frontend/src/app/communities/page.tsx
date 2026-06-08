'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

export default function CommunitiesPage() {
  const { user, roles } = useAuth();
  const [items, setItems] = useState<any[]>([]); const [l, setL] = useState(true);
  useEffect(() => { supabase.from('communities').select('*, members:members(count)').neq('status', 'deleted').order('created_at', { ascending: false }).then(({ data }) => { setItems((data as any) ?? []); setL(false); }); }, []);
  if (l) return <p className="text-zinc-500 p-6">Loading...</p>;
  const isAdmin = roles.includes('super_admin') || roles.includes('community_admin');

  const handleDelete = async (id: string) => { if (!confirm('Archive this community?')) return; await supabase.from('communities').update({ status: 'deleted' }).eq('id', id); setItems(prev => prev.filter(i => i.id !== id)); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Communities</h1>
        {isAdmin && <Link href="/communities/create" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800">Add Community</Link>}
      </div>
      {items.length === 0 && <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center"><p className="text-zinc-500">No communities yet.</p></div>}
      <div className="grid gap-4 sm:grid-cols-2">{items.map(c => (
        <div key={c.id} className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold">{c.name}</h2>
              <p className="text-sm text-zinc-500">{c.slug}</p>
              <p className="text-xs text-zinc-400 mt-1">{c.members?.[0]?.count ?? 0} member(s)</p>
            </div>
            {isAdmin && <div className="flex gap-2">
              <Link href={`/communities/${c.id}/edit`} className="text-sm text-zinc-600 hover:text-zinc-900">Edit</Link>
              <button onClick={() => handleDelete(c.id)} className="text-sm text-red-500 hover:text-red-700">Archive</button>
            </div>}
          </div>
        </div>
      ))}</div>
    </div>
  );
}
