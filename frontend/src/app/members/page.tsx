'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { FamilyTree } from '@/components/family-tree';

const BLOOD = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const PAGE_SIZE = 12;
type ViewMode = 'list' | 'grid' | 'tree';

export default function MembersPage() {
  const { user, roles } = useAuth();
  const isAdmin = roles.includes('super_admin') || roles.includes('community_admin');
  const [members, setMembers] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [families, setFamilies] = useState<any[]>([]);
  const [relationships, setRelationships] = useState<any[]>([]);
  const [filters, setFilters] = useState({ communityIds: [] as string[], familyIds: [] as string[], search: '', bloodGroup: '', profession: '', location: '' });
  const [page, setPage] = useState(1); const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true); const [view, setView] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    supabase.from('communities').select('id,name').then(({ data }) => setCommunities((data as any) ?? []));
    supabase.from('families').select('id,name').then(({ data }) => setFamilies((data as any) ?? []));
    supabase.from('member_relationships').select('*').then(({ data }) => setRelationships((data as any) ?? []));
  }, []);

  const toggleFilter = (key: 'communityIds' | 'familyIds', id: string) => {
    setFilters(p => ({ ...p, [key]: (p[key] as string[]).includes(id) ? (p[key] as string[]).filter(i => i !== id) : [...(p[key] as string[]), id] }));
    setPage(1);
  };

  useEffect(() => {
    setLoading(true);
    let q = supabase.from('members').select('*, family:families(id,name), community:communities(id,name)', { count: 'exact' }).neq('status', 'deleted');
    if (filters.communityIds.length) q = q.in('community_id', filters.communityIds);
    if (filters.familyIds.length) q = q.in('family_id', filters.familyIds);
    if (filters.search) q = q.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`);
    if (filters.bloodGroup) q = q.eq('blood_group', filters.bloodGroup);
    if (filters.profession) q = q.ilike('profession', `%${filters.profession}%`);
    if (filters.location) q = q.ilike('location', `%${filters.location}%`);
    q = q.neq('visibility', 'private');
    q.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1).order('created_at', { ascending: false }).then(({ data, count }) => {
      setMembers((data as any) ?? []); setTotal(count ?? 0); setLoading(false);
    });
  }, [filters, page]);

  const treeData = useMemo(() => {
    return members.filter(m =>
      relationships.some(r => r.member_id === m.id || r.related_member_id === m.id)
    );
  }, [members, relationships]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const filterCount = filters.communityIds.length + filters.familyIds.length + (filters.bloodGroup ? 1 : 0) + (filters.profession ? 1 : 0) + (filters.location ? 1 : 0);

  const MemberCard = ({ m }: { m: any }) => (
    <div className="card" style={{ padding: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
      {m.profile_image ? (
        <img src={m.profile_image} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
      ) : (
        <div className="avatar" style={{ flexShrink: 0 }}>{m.first_name?.[0]}{m.last_name?.[0]}</div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link href={`/members/${m.id}`} style={{ fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none', fontSize: 'var(--font-size-sm)' }}>{m.first_name} {m.last_name}</Link>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: '0.15rem 0 0' }}>
          <span className="capitalize">{m.gender}</span>
          {m.blood_group && <> · {m.blood_group}</>}
          {m.profession && <> · {m.profession}</>}
        </p>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: '0.15rem 0 0' }}>
          {m.location && <>{m.location} · </>}{m.family?.name} · {m.community?.name}
        </p>
      </div>
      {user && isAdmin && <Link href={`/members/${m.id}/edit`} className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>Edit</Link>}
    </div>
  );

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <div className="page-header">
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, margin: 0 }}>Community Members</h1>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {user && isAdmin && <Link href="/members/create" className="btn btn-primary btn-sm">Add Member</Link>}
        </div>
      </div>

      {/* Search bar always visible */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <input placeholder="Search by name..." value={filters.search} onChange={e => { setFilters(p => ({ ...p, search: e.target.value })); setPage(1); }} className="input" style={{ flex: 1 }} />
        <button onClick={() => setShowFilters(!showFilters)} className={`btn btn-sm ${showFilters ? 'btn-primary' : 'btn-outline'}`}>
          {showFilters ? 'Hide Filters' : `Filters ${filterCount > 0 ? `(${filterCount})` : ''}`}
        </button>
      </div>

      {/* Collapsible filters */}
      {showFilters && (
        <div className="card" style={{ padding: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-start' }}>
            {/* Multi-select communities */}
            <div style={{ minWidth: 160 }}>
              <span className="section-title" style={{ display: 'block', marginBottom: '0.25rem' }}>Communities</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {communities.map(c => (
                  <button key={c.id} onClick={() => toggleFilter('communityIds', c.id)}
                    className={`btn btn-sm ${filters.communityIds.includes(c.id) ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: 'var(--font-size-xs)' }}>
                    {c.name} {filters.communityIds.includes(c.id) ? '✓' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Multi-select families */}
            <div style={{ minWidth: 160 }}>
              <span className="section-title" style={{ display: 'block', marginBottom: '0.25rem' }}>Families</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxHeight: 120, overflowY: 'auto' }}>
                {families.map(f => (
                  <button key={f.id} onClick={() => toggleFilter('familyIds', f.id)}
                    className={`btn btn-sm ${filters.familyIds.includes(f.id) ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: 'var(--font-size-xs)' }}>
                    {f.name} {filters.familyIds.includes(f.id) ? '✓' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ minWidth: 120 }}>
              <span className="section-title" style={{ display: 'block', marginBottom: '0.25rem' }}>Blood Group</span>
              <select value={filters.bloodGroup} onChange={e => { setFilters(p => ({ ...p, bloodGroup: e.target.value })); setPage(1); }} className="input" style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--font-size-xs)' }}>
                <option value="">All</option>{BLOOD.filter(Boolean).map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div style={{ minWidth: 120 }}>
              <span className="section-title" style={{ display: 'block', marginBottom: '0.25rem' }}>Profession</span>
              <input placeholder="Filter..." value={filters.profession} onChange={e => { setFilters(p => ({ ...p, profession: e.target.value })); setPage(1); }} className="input" style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--font-size-xs)' }} />
            </div>
            <div style={{ minWidth: 120 }}>
              <span className="section-title" style={{ display: 'block', marginBottom: '0.25rem' }}>Location</span>
              <input placeholder="Filter..." value={filters.location} onChange={e => { setFilters(p => ({ ...p, location: e.target.value })); setPage(1); }} className="input" style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--font-size-xs)' }} />
            </div>
          </div>
        </div>
      )}

      {/* View toggle */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
        {([{ m: 'list', l: 'List', i: '☰' }, { m: 'grid', l: 'Grid', i: '⊞' }, { m: 'tree', l: 'Tree', i: '🌳' }] as const).map(t => (
          <button key={t.m} onClick={() => setView(t.m)} className={`btn btn-sm ${view === t.m ? 'btn-primary' : 'btn-ghost'}`}>
            {t.i} {t.l}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', padding: '0.375rem 0' }}>{total} member{total !== 1 ? 's' : ''}</span>
      </div>

      {loading && <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>Loading...</p>}

      {!loading && view === 'tree' && <FamilyTree members={treeData} relationships={relationships} />}

      {!loading && view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {members.map(m => <MemberCard key={m.id} m={m} />)}
          {members.length === 0 && <div className="card text-center" style={{ padding: '3rem', gridColumn: '1/-1' }}><p style={{ color: 'var(--color-text-muted)' }}>No members found.</p></div>}
        </div>
      )}

      {!loading && view === 'list' && (
        <div className="space-y-1">
          {members.map(m => (
            <div key={m.id} className="card" style={{ padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {m.profile_image ? (
                <img src={m.profile_image} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.65rem', flexShrink: 0 }}>{m.first_name?.[0]}{m.last_name?.[0]}</div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link href={`/members/${m.id}`} style={{ fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>{m.first_name} {m.last_name}</Link>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginLeft: '0.5rem' }} className="capitalize">{m.gender}{m.blood_group && ` · ${m.blood_group}`}</span>
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{m.family?.name}</div>
            </div>
          ))}
          {members.length === 0 && <div className="card text-center" style={{ padding: '3rem' }}><p style={{ color: 'var(--color-text-muted)' }}>No members found.</p></div>}
        </div>
      )}

      {!loading && view !== 'tree' && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn btn-outline btn-sm">Prev</button>
          <span style={{ padding: '0.375rem 0.75rem', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="btn btn-outline btn-sm">Next</button>
        </div>
      )}
    </div>
  );
}
