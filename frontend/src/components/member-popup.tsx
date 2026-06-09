'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Props {
  members: Array<{ id: string; first_name: string; last_name: string }>;
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function MemberPopup({ members, currentIndex, onClose, onNavigate }: Props) {
  const memberId = members[currentIndex]?.id;
  const [m, setM] = useState<any>(null);
  const [rels, setRels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!memberId) return;
    setLoading(true); setRels([]);
    supabase.from('members').select('*, community:communities(name), family:families(name,house_name)').eq('id', memberId).single()
      .then(({ data }) => { setM(data); setLoading(false); });
    supabase.from('member_relationships').select('id,relationship_type,related_member_id').eq('member_id', memberId)
      .then(async ({ data: rels }) => {
        if (!rels?.length) return;
        const ids = rels.map((r: any) => r.related_member_id);
        const { data: names } = await supabase.from('members').select('id,first_name,last_name').in('id', ids);
        const map = new Map((names as any[] || []).map((n: any) => [n.id, n]));
        setRels(rels.map((r: any) => ({ ...r, related: map.get(r.related_member_id) })));
      });
  }, [memberId]);

  const prev = currentIndex > 0;
  const next = currentIndex < members.length - 1;

  const genderColor = m?.gender === 'male' ? 'var(--color-male)' : m?.gender === 'female' ? 'var(--color-female)' : 'var(--color-other)';

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }} onKeyDown={e => {
      if (e.key === 'ArrowLeft' && prev) onNavigate(currentIndex - 1);
      if (e.key === 'ArrowRight' && next) onNavigate(currentIndex + 1);
      if (e.key === 'Escape') onClose();
    }}>
      <div className="modal-content" style={{ maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }} role="dialog" aria-label="Member details">

        {loading ? (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>Loading...</p>
        ) : m ? (
          <>
            {/* Nav bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <button onClick={() => onNavigate(currentIndex - 1)} disabled={!prev} className="btn btn-ghost btn-sm" style={{ visibility: prev ? 'visible' : 'hidden' }}>← Prev</button>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{currentIndex + 1} of {members.length}</span>
              <button onClick={() => onNavigate(currentIndex + 1)} disabled={!next} className="btn btn-ghost btn-sm" style={{ visibility: next ? 'visible' : 'hidden' }}>Next →</button>
            </div>

            {/* Header: Photo + Name */}
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              {m.profile_image ? (
                <img src={m.profile_image} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid ' + genderColor, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', margin: '0 auto', display: 'block' }} />
              ) : (
                <div className={`avatar avatar-lg ${m.gender === 'male' ? 'gender-male' : m.gender === 'female' ? 'gender-female' : 'gender-other'}`} style={{ margin: '0 auto', width: 80, height: 80, fontSize: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>{m.first_name?.[0]}{m.last_name?.[0]}</div>
              )}
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, margin: '0.75rem 0 0' }}>{m.first_name} {m.last_name}</h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                <span className="badge capitalize" style={{ fontSize: '0.65rem' }}>{m.gender}</span>
                {m.blood_group && <span className="badge" style={{ fontSize: '0.65rem', background: 'rgba(196,155,74,0.12)', color: 'var(--color-accent)' }}>{m.blood_group}</span>}
                {m.is_deceased && <span className="badge" style={{ fontSize: '0.65rem', background: 'rgba(196,85,77,0.12)', color: 'var(--color-danger)' }}>Deceased</span>}
              </div>
            </div>

            {/* Info grid: 2 columns */}
            <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius)', padding: '1rem', boxShadow: 'var(--shadow-inner)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.35rem 0.75rem', fontSize: 'var(--font-size-xs)' }}>
                {m.date_of_birth && <><span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Date of Birth</span><span>{new Date(m.date_of_birth).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></>}
                {m.email && <><span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Email</span><span style={{ wordBreak: 'break-all' }}>{m.email}</span></>}
                {m.phone && <><span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Phone</span><span>{m.phone}</span></>}
                {m.profession && <><span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Profession</span><span>{m.profession}</span></>}
                {m.organization && <><span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Organization</span><span>{m.organization}</span></>}
                {m.education && <><span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Education</span><span>{m.education}</span></>}
                {m.location && <><span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Location</span><span>{m.location}</span></>}
                {m.family?.name && <><span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Family</span><span>{m.family.name}{m.family.house_name ? ` (${m.family.house_name})` : ''}</span></>}
                {m.community?.name && <><span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Community</span><span>{m.community.name}</span></>}
              </div>
            </div>

            {/* Relationships */}
            {rels.length > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                <span className="section-title">Family Connections</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {rels.map(r => (
                    <span key={r.id} className="badge capitalize" style={{ fontSize: '0.65rem' }}>{r.relationship_type}: {r.related?.first_name} {r.related?.last_name}</span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>Member not found.</p>
        )}
      </div>
    </div>
  );
}
