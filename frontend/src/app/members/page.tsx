'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { MemberPopup } from '@/components/member-popup';

const BLOOD = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['male', 'female', 'other'];
const PAGE_SIZE = 12;
type ViewMode = 'list' | 'grid';

export default function MembersPage() {
  const { user, roles } = useAuth();
  const isAdmin = roles.includes('super_admin') || roles.includes('community_admin');
  const [members, setMembers] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [families, setFamilies] = useState<any[]>([]);
  const [filters, setFilters] = useState({ communityId: '', familyId: '', search: '', bloodGroup: '', gender: '', profession: '', location: '' });
  const [page, setPage] = useState(1); const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true); const [view, setView] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [popupIndex, setPopupIndex] = useState<number | null>(null);

  useEffect(() => {
    supabase.from('communities').select('id,name').then(({ data }) => setCommunities((data as any) ?? []));
    supabase.from('families').select('id,name,community_id').then(({ data }) => setFamilies((data as any) ?? []));
  }, []);

  useEffect(() => {
    setLoading(true);
    let q = supabase.from('members').select('*, family:families(id,name), community:communities(id,name)', { count: 'exact' }).neq('status', 'deleted');
    if (filters.communityId) q = q.eq('community_id', filters.communityId);
    if (filters.familyId) q = q.eq('family_id', filters.familyId);
    if (filters.search) q = q.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`);
    if (filters.bloodGroup) q = q.eq('blood_group', filters.bloodGroup);
    if (filters.gender) q = q.eq('gender', filters.gender);
    if (filters.profession) q = q.ilike('profession', `%${filters.profession}%`);
    if (filters.location) q = q.ilike('location', `%${filters.location}%`);
    q = q.neq('visibility', 'private');
    q.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1).order('created_at', { ascending: false }).then(({ data, count }) => {
      setMembers((data as any) ?? []); setTotal(count ?? 0); setLoading(false);
    });
  }, [filters, page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const filterCount = (filters.communityId ? 1 : 0) + (filters.familyId ? 1 : 0) + (filters.bloodGroup ? 1 : 0) + (filters.gender ? 1 : 0) + (filters.profession ? 1 : 0) + (filters.location ? 1 : 0);

  const openPopup = (index: number) => setPopupIndex(index);

  return (
    <div style={{ maxWidth: 1024, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, margin: 0 }}>Community Members</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: '0.25rem 0 0', fontSize: 'var(--font-size-xs)' }}>{total} member{total !== 1 ? 's' : ''}</p>
        </div>
        {user && isAdmin && <Link href="/members/create" className="btn btn-primary btn-sm">Add Member</Link>}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input placeholder="Search by name..." value={filters.search} onChange={e => { setFilters(p => ({ ...p, search: e.target.value })); setPage(1); }} className="input" style={{ paddingLeft: '2.25rem' }} />
          <svg style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7" cy="7" r="5.5"/><path d="M11 11l4 4"/></svg>
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`btn btn-sm ${showFilters ? 'btn-primary' : 'btn-outline'}`}>Filters {filterCount > 0 ? `(${filterCount})` : ''}</button>
        <div style={{ display: 'flex', gap: '1px', background: 'var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
          {([{ m: 'grid' as const, l: 'Grid' }, { m: 'list' as const, l: 'List' }]).map(t => (
            <button key={t.m} onClick={() => setView(t.m)} style={{ padding: '0.375rem 0.75rem', fontSize: 'var(--font-size-xs)', fontWeight: 500, border: 'none', cursor: 'pointer', background: view === t.m ? 'var(--color-primary)' : 'white', color: view === t.m ? 'white' : 'var(--color-text)' }}>{t.l}</button>
          ))}
        </div>
      </div>

      {showFilters && (
        <div className="card" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ minWidth: 180 }}><span className="section-title" style={{ display: 'block', marginBottom: '0.25rem' }}>Community</span>
            <select value={filters.communityId} onChange={e => { setFilters(p => ({ ...p, communityId: e.target.value, familyId: '' })); setPage(1); }} className="input"><option value="">All</option>{communities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div style={{ minWidth: 180 }}><span className="section-title" style={{ display: 'block', marginBottom: '0.25rem' }}>Family</span>
            <select value={filters.familyId} onChange={e => { setFilters(p => ({ ...p, familyId: e.target.value })); setPage(1); }} className="input"><option value="">All</option>{families.filter(f => !filters.communityId || f.community_id === filters.communityId).map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div>
          <div style={{ minWidth: 120 }}><span className="section-title" style={{ display: 'block', marginBottom: '0.25rem' }}>Gender</span>
            <select value={filters.gender} onChange={e => { setFilters(p => ({ ...p, gender: e.target.value })); setPage(1); }} className="input"><option value="">All</option>{GENDERS.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
          <div style={{ minWidth: 120 }}><span className="section-title" style={{ display: 'block', marginBottom: '0.25rem' }}>Blood Group</span>
            <select value={filters.bloodGroup} onChange={e => { setFilters(p => ({ ...p, bloodGroup: e.target.value })); setPage(1); }} className="input"><option value="">All</option>{BLOOD.map(b => <option key={b} value={b}>{b}</option>)}</select></div>
          <div style={{ minWidth: 140 }}><span className="section-title" style={{ display: 'block', marginBottom: '0.25rem' }}>Profession</span>
            <input placeholder="e.g. Engineer" value={filters.profession} onChange={e => { setFilters(p => ({ ...p, profession: e.target.value })); setPage(1); }} className="input" /></div>
          <div style={{ minWidth: 140 }}><span className="section-title" style={{ display: 'block', marginBottom: '0.25rem' }}>Location</span>
            <input placeholder="e.g. Kochi" value={filters.location} onChange={e => { setFilters(p => ({ ...p, location: e.target.value })); setPage(1); }} className="input" /></div>
        </div>
      )}

      {loading && <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>Loading...</p>}

      {!loading && view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {members.map((m, i) => (
            <div key={m.id} className="card" style={{ padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', cursor: 'pointer' }} onClick={() => openPopup(i)}>
              {m.profile_image ? (
                <img src={m.profile_image} alt="" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div className="avatar" style={{ width: 52, height: 52, fontSize: '1rem', flexShrink: 0 }}>{m.first_name?.[0]}{m.last_name?.[0]}</div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: 'var(--font-size-sm)' }}>{m.first_name} {m.last_name}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>{m.family?.name}{m.location ? ` · ${m.location}` : ''}</div>
                {m.profession && <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>{m.profession}</div>}
                <div className="flex gap-1" style={{ marginTop: '0.35rem' }}>
                  <span className="badge" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>{m.gender}</span>
                  {m.blood_group && <span className="badge" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem', background: 'rgba(212,168,83,0.12)', color: 'var(--color-accent)' }}>{m.blood_group}</span>}
                </div>
              </div>
            </div>
          ))}
          {members.length === 0 && <div className="card" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1/-1' }}><p style={{ color: 'var(--color-text-muted)' }}>No members found.</p></div>}
        </div>
      )}

      {!loading && view === 'list' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-xs)' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', background: 'rgba(0,0,0,0.02)' }}>
                <th style={{ textAlign: 'left', padding: '0.625rem 1rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '0.625rem 0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Blood</th>
                <th style={{ textAlign: 'left', padding: '0.625rem 0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Profession</th>
                <th style={{ textAlign: 'left', padding: '0.625rem 0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Family</th>
                <th style={{ textAlign: 'left', padding: '0.625rem 0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Location</th>
                <th style={{ textAlign: 'left', padding: '0.625rem 0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Community</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={m.id} style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }} onClick={() => openPopup(i)}>
                  <td style={{ padding: '0.5rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {m.profile_image ? (
                        <img src={m.profile_image} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div className="avatar" style={{ width: 28, height: 28, fontSize: '0.6rem' }}>{m.first_name?.[0]}{m.last_name?.[0]}</div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600 }}>{m.first_name} {m.last_name}</div>
                        <span style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }} className="capitalize">{m.gender}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem' }}>{m.blood_group ? <span className="badge" style={{ fontSize: '0.6rem' }}>{m.blood_group}</span> : <span style={{ color: 'var(--color-text-muted)' }}>—</span>}</td>
                  <td style={{ padding: '0.5rem 0.75rem' }}>{m.profession || <span style={{ color: 'var(--color-text-muted)' }}>—</span>}</td>
                  <td style={{ padding: '0.5rem 0.75rem' }}>{m.family?.name || <span style={{ color: 'var(--color-text-muted)' }}>—</span>}</td>
                  <td style={{ padding: '0.5rem 0.75rem' }}>{m.location || <span style={{ color: 'var(--color-text-muted)' }}>—</span>}</td>
                  <td style={{ padding: '0.5rem 0.75rem' }}>{m.community?.name || <span style={{ color: 'var(--color-text-muted)' }}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {members.length === 0 && <div style={{ padding: '3rem', textAlign: 'center' }}><p style={{ color: 'var(--color-text-muted)' }}>No members found.</p></div>}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn btn-outline btn-sm">Previous</button>
          <span style={{ padding: '0.375rem 0.75rem', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="btn btn-outline btn-sm">Next</button>
        </div>
      )}

      {popupIndex !== null && (
        <MemberPopup
          members={members}
          currentIndex={popupIndex}
          onClose={() => setPopupIndex(null)}
          onNavigate={setPopupIndex}
        />
      )}
    </div>
  );
}
