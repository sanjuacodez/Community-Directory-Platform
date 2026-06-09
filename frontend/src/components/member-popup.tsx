'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface RelationInfo { id: string; relationship_type: string; related?: { first_name: string; last_name: string }; }

interface Props {
  members: Array<{ id: string; first_name: string; last_name: string }>;
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function MemberPopup({ members, currentIndex, onClose, onNavigate }: Props) {
  const memberId = members[currentIndex]?.id;
  const [m, setM] = useState<any>(null);
  const [rels, setRels] = useState<RelationInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!memberId) return;
    setLoading(true);
    setRels([]);
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

  const prev = currentIndex > 0 ? () => onNavigate(currentIndex - 1) : null;
  const next = currentIndex < members.length - 1 ? () => onNavigate(currentIndex + 1) : null;

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }} onKeyDown={e => {
      if (e.key === 'ArrowLeft' && prev) prev();
      if (e.key === 'ArrowRight' && next) next();
      if (e.key === 'Escape') onClose();
    }}>
      <div className="modal-content" style={{ maxWidth: 520, maxHeight: '85vh', overflowY: 'auto' }} role="dialog" aria-label="Member details">
        {/* Navigation bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button onClick={prev || undefined} disabled={!prev} className="btn btn-ghost btn-sm" style={{ opacity: prev ? 1 : 0.3 }} title="Previous">← Prev</button>
            <button onClick={next || undefined} disabled={!next} className="btn btn-ghost btn-sm" style={{ opacity: next ? 1 : 0.3 }} title="Next">Next →</button>
          </div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{currentIndex + 1} / {members.length}</span>
          <button onClick={onClose} className="btn btn-ghost btn-sm">&times;</button>
        </div>

        {loading ? (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>Loading...</p>
        ) : m ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              {m.profile_image ? (
                <img src={m.profile_image} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div className="avatar avatar-lg" style={{ flexShrink: 0 }}>{m.first_name?.[0]}{m.last_name?.[0]}</div>
              )}
              <div>
                <h3 style={{ fontWeight: 700, margin: 0, fontSize: 'var(--font-size-lg)' }}>{m.first_name} {m.last_name}</h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: 0 }} className="capitalize">
                  {m.gender}{m.blood_group && ` · ${m.blood_group}`}{m.profession && ` · ${m.profession}`}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {m.date_of_birth && <div><span className="section-title" style={{display:'block',marginBottom:2}}>DOB</span><span style={{fontSize:'var(--font-size-xs)'}}>{new Date(m.date_of_birth).toLocaleDateString()}</span></div>}
              {m.email && <div><span className="section-title" style={{display:'block',marginBottom:2}}>Email</span><span style={{fontSize:'var(--font-size-xs)'}}>{m.email}</span></div>}
              {m.phone && <div><span className="section-title" style={{display:'block',marginBottom:2}}>Phone</span><span style={{fontSize:'var(--font-size-xs)'}}>{m.phone}</span></div>}
              {m.organization && <div><span className="section-title" style={{display:'block',marginBottom:2}}>Organization</span><span style={{fontSize:'var(--font-size-xs)'}}>{m.organization}</span></div>}
              {m.education && <div><span className="section-title" style={{display:'block',marginBottom:2}}>Education</span><span style={{fontSize:'var(--font-size-xs)'}}>{m.education}</span></div>}
              {m.location && <div><span className="section-title" style={{display:'block',marginBottom:2}}>Location</span><span style={{fontSize:'var(--font-size-xs)'}}>{m.location}</span></div>}
            </div>

            {m.family && <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{m.family.name}{m.family.house_name ? ` (${m.family.house_name})` : ''} · {m.community?.name}</p>}

            {rels.length > 0 && (
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                <span className="section-title">Relations</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {rels.map(r => <span key={r.id} className="badge capitalize" style={{ fontSize: '0.65rem' }}>{r.relationship_type}: {r.related?.first_name} {r.related?.last_name}</span>)}
                </div>
              </div>
            )}

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <Link href={`/members/${memberId}`} className="btn btn-primary btn-sm">Full Profile</Link>
              <button onClick={onClose} className="btn btn-ghost btn-sm">Close</button>
            </div>
          </>
        ) : (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>Member not found.</p>
        )}
      </div>
    </div>
  );
}
