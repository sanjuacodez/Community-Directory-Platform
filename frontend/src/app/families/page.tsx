'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

export default function FamiliesPage() {
  const { user, roles } = useAuth();
  const [families, setFamilies] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [communityId, setCommunityId] = useState('');
  const [loading, setLoading] = useState(true);
  const isAdmin = roles.includes('super_admin') || roles.includes('community_admin');

  useEffect(() => { supabase.from('communities').select('id,name').then(({ data }) => setCommunities((data as any) ?? [])); }, []);

  const load = () => {
    let q = supabase.from('families').select('*, community:communities(id,name), members:members(count)').neq('status', 'deleted');
    if (communityId) q = q.eq('community_id', communityId);
    q.order('created_at', { ascending: false }).then(({ data }) => { setFamilies((data as any) ?? []); setLoading(false); });
  };

  useEffect(() => { load(); }, [communityId]);

  const handleDelete = async (id: string) => { if (!confirm('Archive this family?')) return; await supabase.from('families').update({ status: 'deleted' }).eq('id', id); load(); };

  if (!user) return <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center"><p className="text-zinc-500">Please <a href="/login" className="text-zinc-900 font-medium hover:underline">login</a> to view families.</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Families</h1>
        {isAdmin && <div className="flex gap-2">
          <Link href="/communities/create" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50">+ Community</Link>
          <Link href="/families/create" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800">Add Family</Link>
        </div>}
      </div>
      <select value={communityId} onChange={e => setCommunityId(e.target.value)} className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"><option value="">All Communities</option>{communities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      {loading && <p className="text-zinc-500">Loading...</p>}
      <div className="space-y-3">{families.map(f => (
        <div key={f.id} className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <Link href={`/families/${f.id}`} className="font-semibold hover:text-zinc-600">{f.name}</Link>
              <p className="text-sm text-zinc-500">{f.house_name && `${f.house_name} · `}{f.community?.name}</p>
              <p className="text-xs text-zinc-400 mt-1">{f.members?.[0]?.count ?? 0} member(s) · {f.status === 'active' ? <span className="text-green-600">Active</span> : <span className="text-red-500">{f.status}</span>}</p>
              {f.address && <p className="text-xs text-zinc-400">{f.address}</p>}
            </div>
            {isAdmin && <div className="flex gap-2">
              <Link href={`/families/${f.id}/edit`} className="text-sm text-zinc-600 hover:text-zinc-900">Edit</Link>
              <button onClick={() => handleDelete(f.id)} className="text-sm text-red-500 hover:text-red-700">Archive</button>
            </div>}
          </div>
        </div>
      ))}</div>
    </div>
  );
}
