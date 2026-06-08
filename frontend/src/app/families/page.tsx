'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

interface Family { id: string; name: string; house_name: string|null; address: string|null; status: string; community: {id:string;name:string}; members: {count:number}[] }

export default function FamiliesPage() {
  const { user, roles } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [communities, setCommunities] = useState<{id:string;name:string}[]>([]);
  const [communityId, setCommunityId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('communities').select('id,name').then(({data}) => setCommunities((data as any)??[]));
  }, []);

  useEffect(() => {
    let q = supabase.from('families').select('*, community:communities(id,name)').neq('status','deleted');
    if (communityId) q = q.eq('community_id', communityId);
    q.order('created_at', { ascending: false }).then(({data}) => { setFamilies((data as any)??[]); setLoading(false); });
  }, [communityId]);

  if (!user) return <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center"><p className="text-zinc-500">Please <a href="/login" className="text-zinc-900 font-medium hover:underline">login</a> to view families.</p></div>;

  return (
    <div className="space-y-6"><div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Families</h1>{roles.includes('super_admin')&&<Link href="/families/create" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800">Add Family</Link>}</div>
      <select value={communityId} onChange={e=>setCommunityId(e.target.value)} className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"><option value="">All Communities</option>{communities.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
      {loading&&<p className="text-zinc-500">Loading...</p>}
      <div className="space-y-3">{families.map(f=>(<div key={f.id} className="rounded-xl border border-zinc-200 bg-white p-5"><div className="flex items-start justify-between"><div><h2 className="font-semibold">{f.name}</h2><p className="text-sm text-zinc-500">{f.house_name&&`${f.house_name} · `}{f.community?.name}</p><p className="text-xs text-zinc-400">{f.members?.[0]?.count??0} member(s) · {f.status==='active'?<span className="text-green-600">Active</span>:<span className="text-red-500">{f.status}</span>}</p></div><div className="flex gap-2"><Link href={`/families/${f.id}/edit`} className="text-sm text-zinc-600 hover:text-zinc-900">Edit</Link></div></div></div>))}</div>
    </div>);
}
