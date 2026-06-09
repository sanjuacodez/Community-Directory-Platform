'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Props {
  communityId: string;
  familyId: string;
  onCreated: (member: { id: string; first_name: string; last_name: string; gender: string }) => void;
  onClose: () => void;
}

export function QuickAddMember({ communityId, familyId, onCreated, onClose }: Props) {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [gender, setGender] = useState('male');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!first.trim() || !last.trim()) { setError('Name is required'); return; }
    setLoading(true); setError('');
    try {
      const { data, error: err } = await supabase.from('members').insert({
        community_id: communityId, family_id: familyId,
        first_name: first.trim(), last_name: last.trim(), gender,
        visibility: 'family_only',
      }).select('id,first_name,last_name,gender').single();
      if (err) throw err;
      if (data) onCreated(data);
    } catch (err: any) { setError(err.message || 'Failed to create'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" role="dialog" aria-label="Quick add member">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Quick Add Member</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Close">&times;</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div><label className="block text-sm font-medium mb-1">First Name *</label><input value={first} onChange={e => setFirst(e.target.value)} className="input" autoFocus required /></div>
          <div><label className="block text-sm font-medium mb-1">Last Name *</label><input value={last} onChange={e => setLast(e.target.value)} className="input" required /></div>
          <div><label className="block text-sm font-medium mb-1">Gender</label><select value={gender} onChange={e => setGender(e.target.value)} className="input"><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Community & family assigned automatically. Add more details later from their profile.</p>
          {error && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{error}</p>}
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={loading} className="btn btn-primary flex-1">{loading ? 'Creating...' : 'Add Member'}</button>
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
