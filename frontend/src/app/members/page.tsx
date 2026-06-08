'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

const PAGE_SIZE = 10;

export default function MembersPage() {
  const { user, roles } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [families, setFamilies] = useState<any[]>([]);
  const [communityId, setCommunityId] = useState('');
  const [familyId, setFamilyId] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const isAdmin = roles.includes('super_admin') || roles.includes('community_admin');

  useEffect(() => {
    supabase.from('communities').select('id,name').then(({ data }) => setCommunities((data as any) ?? []));
    supabase.from('families').select('id,name').then(({ data }) => setFamilies((data as any) ?? []));
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    let q = supabase.from('members').select('*, family:families(id,name), community:communities(id,name)', { count: 'exact' }).neq('status', 'deleted');
    if (communityId) q = q.eq('community_id', communityId);
    if (familyId) q = q.eq('family_id', familyId);
    if (search) q = q.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
    q.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1).order('created_at', { ascending: false }).then(({ data, count }) => {
      setMembers((data as any) ?? []); setTotal(count ?? 0); setLoading(false);
    });
  }, [user, communityId, familyId, search, page]);

  if (!user) return <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center"><p className="text-zinc-500">Please <a href="/login" className="text-zinc-900 font-medium hover:underline">login</a>.</p></div>;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Members</h1>{isAdmin && <Link href="/members/create" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800">Add Member</Link>}</div>
      <div className="flex flex-wrap gap-3">
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm w-64" />
        <select value={communityId} onChange={e => { setCommunityId(e.target.value); setPage(1); }} className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"><option value="">All Communities</option>{communities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <select value={familyId} onChange={e => { setFamilyId(e.target.value); setPage(1); }} className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"><option value="">All Families</option>{families.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
      </div>
      {loading && <p className="text-zinc-500">Loading...</p>}
      <div className="space-y-3">
        {members.map(m => (
          <div key={m.id} className="rounded-xl border border-zinc-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Link href={`/members/${m.id}`} className="font-semibold hover:text-zinc-600">{m.first_name} {m.last_name}</Link>
                  <span className="text-xs text-zinc-400 capitalize">({m.gender})</span>
                </div>
                <p className="text-sm text-zinc-500">{m.profession && `${m.profession} · `}{m.blood_group && `${m.blood_group} · `}{m.family?.name}</p>
                <p className="text-xs text-zinc-400">{m.location && `${m.location} · `}{m.community?.name}</p>
              </div>
              {isAdmin && <div className="flex gap-2"><Link href={`/members/${m.id}/edit`} className="text-sm text-zinc-600 hover:text-zinc-900">Edit</Link></div>}
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded border border-zinc-300 px-3 py-1 text-sm disabled:opacity-30">Prev</button>
          <span className="text-sm text-zinc-500 py-1">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded border border-zinc-300 px-3 py-1 text-sm disabled:opacity-30">Next</button>
        </div>
      )}
    </div>
  );
}
