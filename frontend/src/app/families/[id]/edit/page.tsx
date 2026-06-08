'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

export default function EditFamilyPage() {
  const router = useRouter(); const p = useParams(); const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [f, setF] = useState({ name: '', house_name: '', address: '', family_admin_id: '' });
  const [init, setInit] = useState(true); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('members').select('id,first_name,last_name').then(({ data }) => setMembers((data as any) ?? []));
    supabase.from('families').select('*').eq('id', p.id).single().then(({ data }) => {
      if (data) { setF({ name: data.name ?? '', house_name: data.house_name ?? '', address: data.address ?? '', family_admin_id: data.family_admin_id ?? '' }); setInit(false); }
    });
  }, [p.id]);

  if (!user) return <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center"><p className="text-zinc-500">Please <a href="/login" className="text-zinc-900 font-medium hover:underline">login</a>.</p></div>;
  if (init) return <p>Loading...</p>;

  const s = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setError(''); setLoading(true);
    try { const body: any = { ...f }; if (!body.family_admin_id) body.family_admin_id = null;
      const { error: err } = await supabase.from('families').update(body).eq('id', p.id); if (err) throw new Error(err.message); router.push('/families'); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Update failed'); } finally { setLoading(false); } };

  return (
    <div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">Edit Family</h1>
      <form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <div><label className="block text-sm font-medium">Name</label><input value={f.name} onChange={e => s('name', e.target.value)} className="input" required /></div>
        <div><label className="block text-sm font-medium">House Name</label><input value={f.house_name} onChange={e => s('house_name', e.target.value)} className="input" /></div>
        <div><label className="block text-sm font-medium">Address</label><input value={f.address} onChange={e => s('address', e.target.value)} className="input" /></div>
        <div><label className="block text-sm font-medium">Family Admin</label><select value={f.family_admin_id} onChange={e => s('family_admin_id', e.target.value)} className="input"><option value="">None</option>{members.map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}</select><p className="text-xs text-zinc-400 mt-1">Assign a member to manage this family.</p></div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Changes'}</button><button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button></div>
      </form>
    </div>
  );
}
