'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

interface Member { id: string; first_name: string; last_name: string; gender: string; blood_group: string|null; profession: string|null; location: string|null; status: string; family: {id:string;name:string}; community: {id:string;name:string} }

export default function MembersPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [communities, setCommunities] = useState<{id:string;name:string}[]>([]);
  const [families, setFamilies] = useState<{id:string;name:string}[]>([]);
  const [communityId, setCommunityId] = useState('');
  const [familyId, setFamilyId] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('communities').select('id,name').then(({data}) => setCommunities((data as any)??[]));
    supabase.from('families').select('id,name').then(({data}) => setFamilies((data as any)??[]));
  }, []);

  useEffect(() => {
    if (!user) return;
    let q = supabase.from('members').select('*, family:families(id,name), community:communities(id,name)').neq('status','deleted');
    if (communityId) q = q.eq('community_id', communityId);
    if (familyId) q = q.eq('family_id', familyId);
    if (search) q = q.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
    q.order('created_at', { ascending: false }).then(({data}) => { setMembers((data as any)??[]); setLoading(false); });
  }, [user, communityId, familyId, search]);

  if (!user) return <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center"><p className="text-zinc-500">Please <a href="/login" className="text-zinc-900 font-medium hover:underline">login</a> to view members.</p></div>;

  return (
    <div className="space-y-6"><div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Members</h1><Link href="/members/create" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800">Add Member</Link></div>
      <div className="flex flex-wrap gap-3">
        <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm w-64"/>
        <select value={communityId} onChange={e=>setCommunityId(e.target.value)} className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"><option value="">All Communities</option>{communities.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <select value={familyId} onChange={e=>setFamilyId(e.target.value)} className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"><option value="">All Families</option>{families.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</select>
      </div>
      {loading&&<p className="text-zinc-500">Loading...</p>}
      <div className="space-y-3">{members.map(m=>(<div key={m.id} className="rounded-xl border border-zinc-200 bg-white p-5"><div className="flex items-start justify-between"><div><div className="flex items-center gap-2"><Link href={`/members/${m.id}`} className="font-semibold hover:text-zinc-600">{m.first_name} {m.last_name}</Link><span className="text-xs text-zinc-400 capitalize">({m.gender})</span></div><p className="text-sm text-zinc-500">{m.profession&&`${m.profession} · `}{m.blood_group&&`${m.blood_group} · `}{m.family?.name}</p><p className="text-xs text-zinc-400">{m.location&&`${m.location} · `}{m.community?.name}</p></div><div className="flex gap-2"><Link href={`/members/${m.id}/edit`} className="text-sm text-zinc-600 hover:text-zinc-900">Edit</Link></div></div></div>))}</div>
    </div>);
}
