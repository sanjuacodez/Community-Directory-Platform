'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { QuickAddMember } from '@/components/quick-add-member';

const TYPES = ['father', 'mother', 'spouse', 'child'];

export default function MemberProfilePage() {
  const p = useParams(); const { user } = useAuth(); const router = useRouter();
  const [m, setM] = useState<any>(null); const [members, setMembers] = useState<any[]>([]);
  const [l, setL] = useState(true);
  const [showRelForm, setShowRelForm] = useState(false); const [relType, setRelType] = useState('spouse');
  const [relMemberId, setRelMemberId] = useState(''); const [relError, setRelError] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddType, setQuickAddType] = useState('');

  useEffect(() => {
    supabase.from('members').select('*, family:families(*), community:communities(*)').eq('id', p.id).single().then(({ data }) => { setM(data); setL(false); });
    supabase.from('members').select('id,first_name,last_name,gender,family_id').neq('status', 'deleted').then(({ data }) => setMembers((data as any) ?? []));
  }, [p.id]);

  const loadRel = async () => {
    const { data: rels } = await supabase.from('member_relationships').select('id,relationship_type,related_member_id').eq('member_id', p.id);
    if (!rels || rels.length === 0) { setM((prev: any) => ({ ...prev, relationships: [] })); return; }
    const ids = rels.map((r: any) => r.related_member_id);
    const { data: related } = await supabase.from('members').select('id,first_name,last_name').in('id', ids);
    const map = new Map((related as any[] || []).map((m: any) => [m.id, m]));
    setM((prev: any) => ({ ...prev, relationships: rels.map((r: any) => ({ ...r, member: map.get(r.related_member_id) })) }));
  };

  useEffect(() => { if (m) loadRel(); }, [m?.id]);

  const addRel = async (e: React.FormEvent) => { e.preventDefault(); setRelError('');
    try { const { error: err } = await supabase.from('member_relationships').insert({ member_id: p.id, related_member_id: relMemberId, relationship_type: relType });
      if (err) throw new Error(err.message); setShowRelForm(false); setRelMemberId(''); loadRel(); }
    catch (err: any) { setRelError(err.message); }
  };

  const delRel = async (id: string) => { await supabase.from('member_relationships').delete().eq('id', id); loadRel(); };

  const handleQuickCreated = async (newMember: any) => {
    setShowQuickAdd(false);
    // Auto-create the relationship
    await supabase.from('member_relationships').insert({ member_id: p.id, related_member_id: newMember.id, relationship_type: quickAddType });
    if (quickAddType === 'spouse') {
      await supabase.from('member_relationships').insert({ member_id: newMember.id, related_member_id: p.id, relationship_type: 'spouse' });
    }
    if (quickAddType === 'father' || quickAddType === 'mother') {
      await supabase.from('member_relationships').insert({ member_id: newMember.id, related_member_id: p.id, relationship_type: 'child' });
    }
    await loadRel();
    // Refresh members list
    const { data: fresh } = await supabase.from('members').select('id,first_name,last_name,gender,family_id').neq('status', 'deleted');
    setMembers((fresh as any) ?? []);
  };

  if (l) return <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>;
  if (!m) return <p style={{ color: 'var(--color-text-muted)' }}>Not found.</p>;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="avatar avatar-lg">{m.first_name?.[0]}{m.last_name?.[0]}</div>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, margin: 0 }}>{m.first_name} {m.last_name}</h1>
            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>{m.profession || 'Member'} · {m.community?.name}</p>
          </div>
        </div>
        {user && <Link href={`/members/${m.id}/edit`} className="btn btn-outline btn-sm">Edit Profile</Link>}
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {m.gender && <div><span className="section-title" style={{display:'block',marginBottom:2}}>Gender</span><span className="capitalize">{m.gender}</span></div>}
          {m.date_of_birth && <div><span className="section-title" style={{display:'block',marginBottom:2}}>DOB</span>{new Date(m.date_of_birth).toLocaleDateString()}</div>}
          {m.blood_group && <div><span className="section-title" style={{display:'block',marginBottom:2}}>Blood</span><span className="badge">{m.blood_group}</span></div>}
          {m.email && <div><span className="section-title" style={{display:'block',marginBottom:2}}>Email</span>{m.email}</div>}
          {m.phone && <div><span className="section-title" style={{display:'block',marginBottom:2}}>Phone</span>{m.phone}</div>}
          {m.location && <div><span className="section-title" style={{display:'block',marginBottom:2}}>Location</span>{m.location}</div>}
          {m.profession && <div><span className="section-title" style={{display:'block',marginBottom:2}}>Profession</span>{m.profession}</div>}
          {m.organization && <div><span className="section-title" style={{display:'block',marginBottom:2}}>Organization</span>{m.organization}</div>}
          {m.education && <div><span className="section-title" style={{display:'block',marginBottom:2}}>Education</span>{m.education}</div>}
        </div>
        {m.is_deceased && <p style={{ color: 'var(--color-danger)', marginTop: '1rem' }}>Deceased</p>}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title" style={{marginBottom:0}}>Family Connections</h2>
          {user && !showRelForm && (
            <button onClick={() => setShowRelForm(true)} className="btn btn-accent btn-sm">+ Connect</button>
          )}
        </div>

        {showRelForm && (
          <form onSubmit={addRel} className="p-3 mb-3 rounded-lg" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
            <div className="flex flex-wrap gap-2 items-end">
              <div style={{ minWidth: 100 }}>
                <label className="text-xs font-medium block mb-1">Relation</label>
                <select value={relType} onChange={e => setRelType(e.target.value)} className="input" style={{padding:'0.4rem 0.5rem',fontSize:'var(--font-size-xs)'}}>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 150 }}>
                <label className="text-xs font-medium block mb-1">Member</label>
                <select value={relMemberId} onChange={e => setRelMemberId(e.target.value)} className="input" style={{padding:'0.4rem 0.5rem',fontSize:'var(--font-size-xs)'}} required>
                  <option value="">Select existing</option>
                  {members.filter(mm => mm.id !== m.id && mm.family_id === m.family_id).map(mm => <option key={mm.id} value={mm.id}>{mm.first_name} {mm.last_name}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-sm">Link</button>
              <button type="button" onClick={() => { setShowRelForm(false); setQuickAddType(relType); setShowQuickAdd(true); }} className="btn btn-outline btn-sm" title="Quick add new member">+ New</button>
              <button type="button" onClick={() => setShowRelForm(false)} className="btn btn-ghost btn-sm">Cancel</button>
            </div>
            {relError && <p className="text-sm mt-2" style={{ color: 'var(--color-danger)' }}>{relError}</p>}
          </form>
        )}

        <div className="space-y-2">
          {m.relationships?.map((r: any) => (
            <div key={r.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <span className="badge capitalize">{r.relationship_type}</span>
                <Link href={`/members/${r.related_member_id}`} style={{ fontWeight: 500, color: 'var(--color-primary)' }}>
                  {r.member?.first_name} {r.member?.last_name}
                </Link>
              </div>
              <button onClick={() => delRel(r.id)} className="btn btn-danger btn-sm">Remove</button>
            </div>
          ))}
          {(!m.relationships || m.relationships.length === 0) && (
            <p style={{ color: 'var(--color-text-muted)' }}>No relationships added yet. Click "+ Connect" to link family members.</p>
          )}
        </div>
      </div>

      {m.family && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <p className="section-title">Family</p>
          <div className="flex items-center gap-2">
            <Link href={`/families/${m.family.id}`} style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{m.family.name}</Link>
            {m.family.house_name && <span style={{ color: 'var(--color-text-muted)' }}>({m.family.house_name})</span>}
          </div>
        </div>
      )}

      <Link href="/members" className="btn btn-ghost btn-sm" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>← Back to Members</Link>

      {showQuickAdd && (
        <QuickAddMember
          communityId={m.community_id}
          familyId={m.family_id}
          onCreated={handleQuickCreated}
          onClose={() => setShowQuickAdd(false)}
        />
      )}
    </div>
  );
}
