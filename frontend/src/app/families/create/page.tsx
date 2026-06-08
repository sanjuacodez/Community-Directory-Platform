'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

export default function CreateFamilyPage() {
  const router = useRouter(); const { user } = useAuth();
  const [communities, setCommunities] = useState<any[]>([]); const [members, setMembers] = useState<any[]>([]);
  const [f, setF] = useState({ community_id: '', name: '', house_name: '', address: '', family_admin_id: '' });
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);

  useEffect(() => { supabase.from('communities').select('id,name').then(({ data }) => setCommunities((data as any) ?? [])); supabase.from('members').select('id,first_name,last_name,community_id').then(({ data }) => setMembers((data as any) ?? [])); }, []);

  if (!user) return <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center"><p className="text-zinc-500">Please <a href="/login" className="text-zinc-900 font-medium hover:underline">login</a>.</p></div>;

  const submit = async (e: React.FormEvent) => { e.preventDefault(); setError(''); setLoading(true);
    try { const body: any = { ...f }; if (!body.family_admin_id) delete body.family_admin_id;
      const { error: err } = await supabase.from('families').insert(body); if (err) throw new Error(err.message); router.push('/families'); }
    catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">Create Family</h1>
      <form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <div><label className="block text-sm font-medium">Community *</label><select value={f.community_id} onChange={e => setF(p => ({ ...p, community_id: e.target.value }))} className="input mt-1" required><option value="">Select</option>{communities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div><label className="block text-sm font-medium">Family Name *</label><input value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} className="input mt-1" required /></div>
        <div><label className="block text-sm font-medium">House Name</label><input value={f.house_name} onChange={e => setF(p => ({ ...p, house_name: e.target.value }))} className="input mt-1" /></div>
        <div><label className="block text-sm font-medium">Address</label><input value={f.address} onChange={e => setF(p => ({ ...p, address: e.target.value }))} className="input mt-1" /></div>
        <div><label className="block text-sm font-medium">Family Admin (optional)</label><select value={f.family_admin_id} onChange={e => setF(p => ({ ...p, family_admin_id: e.target.value }))} className="input"><option value="">None</option>{members.filter(m => !f.community_id || m.community_id === f.community_id).map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}</select><p className="text-xs text-zinc-400 mt-1">Select a member to assign as admin.</p></div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading ? 'Creating...' : 'Create Family'}</button><button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button></div>
      </form>
    </div>
  );
}
