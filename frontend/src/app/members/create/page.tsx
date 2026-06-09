'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { ImageUpload } from '@/components/image-upload';

const BLOOD = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <div><label className="block text-sm font-medium">{label} {required && '*'}</label><div className="mt-1">{children}</div></div>;
}

export default function CreateMemberPage() {
  const router = useRouter(); const { user } = useAuth();
  const [communities, setCommunities] = useState<any[]>([]); const [families, setFamilies] = useState<any[]>([]);
  const [existingMembers, setExistingMembers] = useState<any[]>([]);
  const [f, setF] = useState<any>({ community_id: '', family_id: '', first_name: '', last_name: '', gender: '', date_of_birth: '', blood_group: '', email: '', phone: '', profession: '', organization: '', education: '', location: '', profile_image: '', visibility: 'community_only', is_deceased: false });
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

  const familyMembers = existingMembers.filter(m => m.family_id === f.family_id && m.id !== '');
  const fatherCandidates = familyMembers.filter(m => m.gender === 'male');
  const motherCandidates = familyMembers.filter(m => m.gender === 'female');

  const submit = async (e: React.FormEvent) => { e.preventDefault(); setError(''); setLoading(true);
    try {
      const body: any = { ...f };
      Object.keys(body).forEach(k => { if (body[k] === '' && k !== 'is_deceased' && k !== 'visibility') delete body[k]; });
      const { data: newMember, error: err } = await supabase.from('members').insert(body).select().single();
      if (err) throw new Error(err.message);
      if (!newMember) throw new Error('Creation failed');

      const relationships: any[] = [];
      if (fatherId) { relationships.push({ member_id: newMember.id, related_member_id: fatherId, relationship_type: 'father' }); relationships.push({ member_id: fatherId, related_member_id: newMember.id, relationship_type: 'child' }); }
      if (motherId) { relationships.push({ member_id: newMember.id, related_member_id: motherId, relationship_type: 'mother' }); relationships.push({ member_id: motherId, related_member_id: newMember.id, relationship_type: 'child' }); }
      if (spouseId) { relationships.push({ member_id: newMember.id, related_member_id: spouseId, relationship_type: 'spouse' }); relationships.push({ member_id: spouseId, related_member_id: newMember.id, relationship_type: 'spouse' }); }
      if (relationships.length > 0) await supabase.from('member_relationships').insert(relationships);

      router.push('/members');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Add Member</h1>
      <form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First Name" required><input type="text" value={f.first_name} onChange={e => setF((p: any) => ({ ...p, first_name: e.target.value }))} className="input" required /></Field>
          <Field label="Last Name" required><input type="text" value={f.last_name} onChange={e => setF((p: any) => ({ ...p, last_name: e.target.value }))} className="input" required /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Community" required><select value={f.community_id} onChange={e => setF((p: any) => ({ ...p, community_id: e.target.value }))} className="input" required><option value="">Select</option>{communities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
          <Field label="Family" required><select value={f.family_id} onChange={e => { setF((p: any) => ({ ...p, family_id: e.target.value })); setFatherId(''); setMotherId(''); setSpouseId(''); }} className="input" required><option value="">Select</option>{families.filter(ff => !f.community_id || ff.community_id === f.community_id).map(ff => <option key={ff.id} value={ff.id}>{ff.name}</option>)}</select></Field>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <Field label="Gender" required><select value={f.gender} onChange={e => setF((p: any) => ({ ...p, gender: e.target.value }))} className="input" required><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></Field>
          <Field label="DOB"><input type="date" value={f.date_of_birth} onChange={e => setF((p: any) => ({ ...p, date_of_birth: e.target.value }))} className="input" /></Field>
          <Field label="Blood Group"><select value={f.blood_group} onChange={e => setF((p: any) => ({ ...p, blood_group: e.target.value }))} className="input">{BLOOD.map(b => <option key={b} value={b}>{b || 'None'}</option>)}</select></Field>
          <div><label className="block text-sm font-medium">&nbsp;</label><label className="flex items-center gap-2 text-sm pt-2"><input type="checkbox" checked={f.is_deceased} onChange={e => setF((p: any) => ({ ...p, is_deceased: e.target.checked }))} /> Deceased</label></div>
        </div>

        {f.family_id && familyMembers.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-zinc-600 mb-3">Family Connections</h3>
            <p className="text-xs text-zinc-400 mb-3">Link this member to existing family members. Relationships will be created automatically.</p>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Father"><select value={fatherId} onChange={e => setFatherId(e.target.value)} className="input"><option value="">Select</option>{fatherCandidates.map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}</select></Field>
              <Field label="Mother"><select value={motherId} onChange={e => setMotherId(e.target.value)} className="input"><option value="">Select</option>{motherCandidates.map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}</select></Field>
              <Field label="Spouse"><select value={spouseId} onChange={e => setSpouseId(e.target.value)} className="input"><option value="">Select</option>{familyMembers.map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}</select></Field>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Email"><input type="email" value={f.email ?? ''} onChange={e => setF((p: any) => ({ ...p, email: e.target.value }))} className="input" /></Field>
          <Field label="Phone"><input type="text" value={f.phone ?? ''} onChange={e => setF((p: any) => ({ ...p, phone: e.target.value }))} className="input" /></Field>
          <Field label="WhatsApp"><input type="text" value={f.whatsapp ?? ''} onChange={e => setF((p: any) => ({ ...p, whatsapp: e.target.value }))} className="input" placeholder="+91xxxxxxxxxx" /></Field>
          <Field label="Location"><input type="text" value={f.location ?? ''} onChange={e => setF((p: any) => ({ ...p, location: e.target.value }))} className="input" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Profession"><input type="text" value={f.profession ?? ''} onChange={e => setF((p: any) => ({ ...p, profession: e.target.value }))} className="input" /></Field>
          <Field label="Organization"><input type="text" value={f.organization ?? ''} onChange={e => setF((p: any) => ({ ...p, organization: e.target.value }))} className="input" /></Field>
          <Field label="Education"><input type="text" value={f.education ?? ''} onChange={e => setF((p: any) => ({ ...p, education: e.target.value }))} className="input" /></Field>
          <Field label="Facebook"><input type="text" value={f.facebook ?? ''} onChange={e => setF((p: any) => ({ ...p, facebook: e.target.value }))} className="input" placeholder="https://fb.com/..." /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Instagram"><input type="text" value={f.instagram ?? ''} onChange={e => setF((p: any) => ({ ...p, instagram: e.target.value }))} className="input" placeholder="https://instagram.com/..." /></Field>
          <Field label="LinkedIn"><input type="text" value={f.linkedin ?? ''} onChange={e => setF((p: any) => ({ ...p, linkedin: e.target.value }))} className="input" placeholder="https://linkedin.com/in/..." /></Field>
          <Field label="Twitter/X"><input type="text" value={f.twitter ?? ''} onChange={e => setF((p: any) => ({ ...p, twitter: e.target.value }))} className="input" placeholder="https://x.com/..." /></Field>
        </div>

        <ImageUpload currentUrl={f.profile_image || null} onUpload={(url) => setF((p: any) => ({ ...p, profile_image: url }))} />

        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-700">
          <strong>Note:</strong> If the member needs to login, ask them to register at <a href="/login" target="_blank" className="underline">the login page</a> with the same email first. Then create their member record here.
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading ? 'Creating...' : 'Create Member'}</button><button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button></div>
      </form>
    </div>
  );
}
