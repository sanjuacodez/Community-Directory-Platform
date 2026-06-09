'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { ImageUpload } from '@/components/image-upload';

const BLOOD = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-sm font-medium">{label}</label><div className="mt-1">{children}</div></div>;
}

export default function EditMemberPage() {
  const router = useRouter(); const p = useParams(); const { user } = useAuth();
  const [communities, setCommunities] = useState<any[]>([]); const [families, setFamilies] = useState<any[]>([]);
  const [f, setF] = useState<any>({});
  const [init, setInit] = useState(true); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('communities').select('id,name').then(({ data }) => setCommunities((data as any) ?? []));
    supabase.from('families').select('id,name,community_id').then(({ data }) => setFamilies((data as any) ?? []));
    supabase.from('members').select('*').eq('id', p.id).single().then(({ data }) => { if (data) { setF(data); setInit(false); } });
  }, [p.id]);

  if (!user) return <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center"><p className="text-zinc-500">Please <a href="/login" className="text-zinc-900 font-medium hover:underline">login</a>.</p></div>;
  if (init) return <p>Loading...</p>;

  const submit = async (e: React.FormEvent) => { e.preventDefault(); setError(''); setLoading(true);
    try {
      const { error: err } = await supabase.from('members').update({
        first_name: f.first_name, last_name: f.last_name, community_id: f.community_id, family_id: f.family_id,
        gender: f.gender, date_of_birth: f.date_of_birth || null, blood_group: f.blood_group || null,
        email: f.email || null, phone: f.phone || null, profession: f.profession || null,
        organization: f.organization || null, education: f.education || null, location: f.location || null,
        profile_image: f.profile_image || null, is_deceased: f.is_deceased ?? false,
      }).eq('id', p.id);
      if (err) throw new Error(err.message);
      router.push('/members');
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Update failed'); } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Edit Member</h1>
      <form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First Name"><input value={f.first_name ?? ''} onChange={e => setF((p: any) => ({ ...p, first_name: e.target.value }))} className="input" required /></Field>
          <Field label="Last Name"><input value={f.last_name ?? ''} onChange={e => setF((p: any) => ({ ...p, last_name: e.target.value }))} className="input" required /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Community"><select value={f.community_id ?? ''} onChange={e => setF((p: any) => ({ ...p, community_id: e.target.value }))} className="input" required>{communities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
          <Field label="Family"><select value={f.family_id ?? ''} onChange={e => setF((p: any) => ({ ...p, family_id: e.target.value }))} className="input" required>{families.filter(ff => !f.community_id || ff.community_id === f.community_id).map(ff => <option key={ff.id} value={ff.id}>{ff.name}</option>)}</select></Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Gender"><select value={f.gender ?? ''} onChange={e => setF((p: any) => ({ ...p, gender: e.target.value }))} className="input"><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></Field>
          <Field label="DOB"><input type="date" value={f.date_of_birth?.split('T')[0] ?? ''} onChange={e => setF((p: any) => ({ ...p, date_of_birth: e.target.value }))} className="input" /></Field>
          <Field label="Blood Group"><select value={f.blood_group ?? ''} onChange={e => setF((p: any) => ({ ...p, blood_group: e.target.value }))} className="input">{BLOOD.map(b => <option key={b} value={b}>{b || 'None'}</option>)}</select></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email"><input type="email" value={f.email ?? ''} onChange={e => setF((p: any) => ({ ...p, email: e.target.value }))} className="input" /></Field>
          <Field label="Phone"><input value={f.phone ?? ''} onChange={e => setF((p: any) => ({ ...p, phone: e.target.value }))} className="input" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Profession"><input value={f.profession ?? ''} onChange={e => setF((p: any) => ({ ...p, profession: e.target.value }))} className="input" /></Field>
          <Field label="Organization"><input value={f.organization ?? ''} onChange={e => setF((p: any) => ({ ...p, organization: e.target.value }))} className="input" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Education"><input value={f.education ?? ''} onChange={e => setF((p: any) => ({ ...p, education: e.target.value }))} className="input" /></Field>
          <Field label="Location"><input value={f.location ?? ''} onChange={e => setF((p: any) => ({ ...p, location: e.target.value }))} className="input" /></Field>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.is_deceased ?? false} onChange={e => setF((p: any) => ({ ...p, is_deceased: e.target.checked }))} /> Mark as deceased</label>
        <ImageUpload currentUrl={f.profile_image || null} onUpload={(url) => setF((p: any) => ({ ...p, profile_image: url }))} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Changes'}</button><button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button></div>
      </form>
    </div>
  );
}
