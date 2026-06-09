'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

const BLOOD = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const PAGE_SIZE = 12;

export default function MembersPage() {
  const { user, roles } = useAuth();
  const isAdmin = roles.includes('super_admin') || roles.includes('community_admin');
  const [members, setMembers] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [families, setFamilies] = useState<any[]>([]);
  const [communityId, setCommunityId] = useState('');
  const [familyId, setFamilyId] = useState('');
  const [search, setSearch] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [profession, setProfession] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('communities').select('id,name').then(({ data }) => setCommunities((data as any) ?? []));
    supabase.from('families').select('id,name').then(({ data }) => setFamilies((data as any) ?? []));
  }, []);

  useEffect(() => {
    setLoading(true);
    let q = supabase.from('members').select('*, family:families(id,name), community:communities(id,name)', { count: 'exact' }).neq('status', 'deleted');

    if (communityId) q = q.eq('community_id', communityId);
    if (familyId) q = q.eq('family_id', familyId);
    if (search) q = q.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
    if (bloodGroup) q = q.eq('blood_group', bloodGroup);
    if (profession) q = q.ilike('profession', `%${profession}%`);
    if (location) q = q.ilike('location', `%${location}%`);
    q = q.neq('visibility', 'private');

    q.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1).order('created_at', { ascending: false }).then(({ data, count }) => {
      setMembers((data as any) ?? []); setTotal(count ?? 0); setLoading(false);
    });
  }, [communityId, familyId, search, bloodGroup, profession, location, page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div style={{maxWidth:900,margin:'0 auto'}}>
      <div className="page-header">
        <h1 style={{fontSize:'var(--font-size-2xl)',fontWeight:700}}>Community Members</h1>
        {user && isAdmin && <Link href="/members/create" className="btn btn-primary btn-sm">Add Member</Link>}
      </div>

      <div className="card" style={{marginBottom:'1rem',padding:'1rem'}}>
        <div className="flex flex-wrap gap-2">
          <input placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} className="input" style={{maxWidth:200}} />
          <select value={communityId} onChange={e => { setCommunityId(e.target.value); setPage(1); }} className="input" style={{maxWidth:180}}><option value="">All Communities</option>{communities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          <select value={familyId} onChange={e => { setFamilyId(e.target.value); setPage(1); }} className="input" style={{maxWidth:180}}><option value="">All Families</option>{families.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
          <select value={bloodGroup} onChange={e => { setBloodGroup(e.target.value); setPage(1); }} className="input" style={{maxWidth:140}}><option value="">Blood Group</option>{BLOOD.filter(Boolean).map(b => <option key={b} value={b}>{b}</option>)}</select>
          <input placeholder="Profession..." value={profession} onChange={e => { setProfession(e.target.value); setPage(1); }} className="input" style={{maxWidth:140}} />
          <input placeholder="Location..." value={location} onChange={e => { setLocation(e.target.value); setPage(1); }} className="input" style={{maxWidth:140}} />
        </div>
      </div>

      {loading && <p style={{color:'var(--color-text-muted)'}}>Loading...</p>}

      {!loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {members.map(m => (
              <div key={m.id} className="card" style={{padding:'1rem'}}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="avatar">{m.first_name?.[0]}{m.last_name?.[0]}</div>
                  <div>
                    {user ? (
                      <Link href={`/members/${m.id}`} style={{fontWeight:600,color:'var(--color-primary)',textDecoration:'none'}}>{m.first_name} {m.last_name}</Link>
                    ) : (
                      <strong>{m.first_name} {m.last_name}</strong>
                    )}
                    <p style={{fontSize:'var(--font-size-xs)',color:'var(--color-text-muted)',margin:0}} className="capitalize">{m.gender}{m.blood_group && ` · ${m.blood_group}`}</p>
                  </div>
                </div>
                <p style={{fontSize:'var(--font-size-xs)',color:'var(--color-text-muted)',margin:0}}>
                  {m.profession && <>{m.profession} · </>}
                  {m.family?.name} · {m.community?.name}
                </p>
                {m.location && <p style={{fontSize:'var(--font-size-xs)',color:'var(--color-text-muted)',margin:'0.25rem 0 0'}}>{m.location}</p>}
              </div>
            ))}
          </div>

          {members.length === 0 && <div className="card text-center" style={{padding:'3rem'}}><p style={{color:'var(--color-text-muted)'}}>No members found.</p></div>}

          {totalPages > 1 && (
            <div style={{display:'flex',justifyContent:'center',gap:'0.5rem',marginTop:'1.5rem'}}>
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn btn-outline btn-sm">Prev</button>
              <span style={{padding:'0.375rem 0.75rem',fontSize:'var(--font-size-xs)',color:'var(--color-text-muted)'}}>Page {page} of {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="btn btn-outline btn-sm">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
