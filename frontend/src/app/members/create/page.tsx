'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

const BLOOD = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function CreateMemberPage() {
  const router = useRouter(); const { user } = useAuth();
  const [communities, setCommunities] = useState<any[]>([]); const [families, setFamilies] = useState<any[]>([]);
  const [existingMembers, setExistingMembers] = useState<any[]>([]);
  const [f, setF] = useState<any>({ community_id: '', family_id: '', first_name: '', last_name: '', gender: '', date_of_birth: '', blood_group: '', email: '', phone: '', profession: '', organization: '', education: '', location: '', visibility: 'community_only', is_deceased: false });
  const [fatherId, setFatherId] = useState('');
  const [motherId, setMotherId] = useState('');
  const [spouseId, setSpouseId] = useState('');
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('communities').select('id,name').then(({ data }) => setCommunities((data as any) ?? []));
    supabase.from('families').select('id,name,community_id').then(({ data }) => setFamilies((data as any) ?? []));
    supabase.from('members').select('id,first_name,last_name,gender,family_id').neq('status', 'deleted').then(({ data }) => setExistingMembers((data as any) ?? []));
  }, []);

  if (!user) return <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center"><p className="text-zinc-500">Please <a href="/login" className="text-zinc-900 font-medium hover:underline">login</a>.</p></div>;

  const s = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));
  const familyMembers = existingMembers.filter(m => m.family_id === f.family_id && m.id !== '');

  const submit = async (e: React.FormEvent) => { e.preventDefault(); setError(''); setLoading(true);
    try {
      const body: any = { ...f };
      Object.keys(body).forEach(k => { if (body[k] === '' && k !== 'is_deceased' && k !== 'visibility') delete body[k]; });
      const { data: newMember, error: err } = await supabase.from('members').insert(body).select().single();
      if (err) throw new Error(err.message);
      if (!newMember) throw new Error('Member creation failed');

      // Auto-create relationships
      const relationships: any[] = [];
      if (fatherId) relationships.push({ member_id: newMember.id, related_member_id: fatherId, relationship_type: 'father' });
      if (motherId) relationships.push({ member_id: newMember.id, related_member_id: motherId, relationship_type: 'mother' });
      if (spouseId) {
        relationships.push({ member_id: newMember.id, related_member_id: spouseId, relationship_type: 'spouse' });
        relationships.push({ member_id: spouseId, related_member_id: newMember.id, relationship_type: 'spouse' });
      }
      if (fatherId) relationships.push({ member_id: fatherId, related_member_id: newMember.id, relationship_type: 'child' });
      if (motherId) relationships.push({ member_id: motherId, related_member_id: newMember.id, relationship_type: 'child' });

      if (relationships.length > 0) {
        const { error: relErr } = await supabase.from('member_relationships').insert(relationships);
        if (relErr) console.warn('Relationship error:', relErr.message);
      }

      router.push('/members');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const Input = ({ label, field, type = 'text', required }: any) => <div><label className="block text-sm font-medium">{label} {required && '*'}</label><input type={type} value={f[field] ?? ''} onChange={e => s(field, e.target.value)} className="input" required={required} /></div>;

  const fatherCandidates = familyMembers.filter(m => m.gender === 'male');
  const motherCandidates = familyMembers.filter(m => m.gender === 'female');

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Add Member</h1>
      <form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <div className="grid grid-cols-2 gap-3">
          <Input label="First Name" field="first_name" required />
          <Input label="Last Name" field="last_name" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm font-medium">Community *</label><select value={f.community_id} onChange={e => s('community_id', e.target.value)} className="input" required><option value="">Select</option>{communities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div><label className="block text-sm font-medium">Family *</label><select value={f.family_id} onChange={e => { s('family_id', e.target.value); setFatherId(''); setMotherId(''); setSpouseId(''); }} className="input" required><option value="">Select</option>{families.filter(ff => !f.community_id || ff.community_id === f.community_id).map(ff => <option key={ff.id} value={ff.id}>{ff.name}</option>)}</select></div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div><label className="block text-sm font-medium">Gender *</label><select value={f.gender} onChange={e => s('gender', e.target.value)} className="input" required><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
          <div><label className="block text-sm font-medium">DOB</label><input type="date" value={f.date_of_birth} onChange={e => s('date_of_birth', e.target.value)} className="input" /></div>
          <div><label className="block text-sm font-medium">Blood Group</label><select value={f.blood_group} onChange={e => s('blood_group', e.target.value)} className="input">{BLOOD.map(b => <option key={b} value={b}>{b || 'None'}</option>)}</select></div>
          <div><label className="block text-sm font-medium">&nbsp;</label><label className="flex items-center gap-2 text-sm pt-2"><input type="checkbox" checked={f.is_deceased} onChange={e => s('is_deceased', e.target.checked)} /> Deceased</label></div>
        </div>

        {f.family_id && familyMembers.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-zinc-600 mb-3">Family Connections</h3>
            <p className="text-xs text-zinc-400 mb-3">Link this member to existing family members. Relationships will be created automatically.</p>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="block text-sm font-medium">Father</label><select value={fatherId} onChange={e => setFatherId(e.target.value)} className="input"><option value="">Select</option>{fatherCandidates.map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}</select></div>
              <div><label className="block text-sm font-medium">Mother</label><select value={motherId} onChange={e => setMotherId(e.target.value)} className="input"><option value="">Select</option>{motherCandidates.map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}</select></div>
              <div><label className="block text-sm font-medium">Spouse</label><select value={spouseId} onChange={e => setSpouseId(e.target.value)} className="input"><option value="">Select</option>{familyMembers.map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}</select></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3"><Input label="Email" field="email" type="email" /><Input label="Phone" field="phone" /></div>
        <div className="grid grid-cols-2 gap-3"><Input label="Profession" field="profession" /><Input label="Organization" field="organization" /></div>
        <div className="grid grid-cols-2 gap-3"><Input label="Education" field="education" /><Input label="Location" field="location" /></div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading ? 'Creating...' : 'Create Member'}</button><button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button></div>
      </form>
    </div>
  );
}
