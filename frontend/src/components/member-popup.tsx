'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface MemberData {
  id: string; first_name: string; last_name: string; gender: string;
  date_of_birth?: string; blood_group?: string; email?: string; phone?: string;
  profession?: string; organization?: string; education?: string; location?: string;
  profile_image?: string; is_deceased?: boolean;
  community?: { id: string; name: string }; family?: { id: string; name: string; house_name?: string };
}

export function MemberPopup({ memberId, onClose }: { memberId: string; onClose: () => void }) {
  const [m, setM] = useState<MemberData | null>(null);
  const [rels, setRels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('members').select('*, community:communities(name), family:families(name,house_name)').eq('id', memberId).single()
      .then(({ data }) => { setM(data as any); setLoading(false); });
    supabase.from('member_relationships').select('id,relationship_type,related_member_id').eq('member_id', memberId)
      .then(async ({ data: rels }) => {
        if (!rels?.length) return;
        const ids = rels.map((r: any) => r.related_member_id);
        const { data: names } = await supabase.from('members').select('id,first_name,last_name').in('id', ids);
        const map = new Map((names as any[] || []).map((n: any) => [n.id, n]));
        setRels(rels.map((r: any) => ({ ...r, related: map.get(r.related_member_id) })));
      });
  }, [memberId]);

  if (loading) return null;

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: 480 }} role="dialog" aria-label="Member details">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {m?.profile_image ? (
              <img src={m.profile_image} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div className="avatar avatar-lg">{m?.first_name?.[0]}{m?.last_name?.[0]}</div>
            )}
            <div>
              <h3 style={{ fontWeight: 700, margin: 0 }}>{m?.first_name} {m?.last_name}</h3>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: 0 }} className="capitalize">{m?.gender}{m?.blood_group && ` · ${m?.blood_group}`}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm">&times;</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
          {m?.profession && <div><span className="section-title">Work</span> <span style={{fontSize:'var(--font-size-xs)'}}>{m.profession}</span></div>}
          {m?.location && <div><span className="section-title">Location</span> <span style={{fontSize:'var(--font-size-xs)'}}>{m.location}</span></div>}
          {m?.email && <div><span className="section-title">Email</span> <span style={{fontSize:'var(--font-size-xs)'}}>{m.email}</span></div>}
          {m?.phone && <div><span className="section-title">Phone</span> <span style={{fontSize:'var(--font-size-xs)'}}>{m.phone}</span></div>}
          {m?.organization && <div><span className="section-title">Org</span> <span style={{fontSize:'var(--font-size-xs)'}}>{m.organization}</span></div>}
          {m?.education && <div><span className="section-title">Education</span> <span style={{fontSize:'var(--font-size-xs)'}}>{m.education}</span></div>}
          {m?.date_of_birth && <div><span className="section-title">DOB</span> <span style={{fontSize:'var(--font-size-xs)'}}>{new Date(m.date_of_birth).toLocaleDateString()}</span></div>}
        </div>

        {m?.family && <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{m.family.name}{m.family.house_name ? ` (${m.family.house_name})` : ''} · {m.community?.name}</p>}

        {rels.length > 0 && (
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
            <span className="section-title">Relations</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {rels.map(r => (
                <span key={r.id} className="badge capitalize" style={{ fontSize: '0.65rem' }}>{r.relationship_type}: {r.related?.first_name} {r.related?.last_name}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <Link href={`/members/${memberId}`} className="btn btn-primary btn-sm">Full Profile</Link>
          <button onClick={onClose} className="btn btn-ghost btn-sm">Close</button>
        </div>
      </div>
    </div>
  );
}
