'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

export default function CreateCommunityPage() {
  const router = useRouter(); const { user, roles } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [name, setName] = useState(''); const [slug, setSlug] = useState(''); const [adminId, setAdminId] = useState('');
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);

  useEffect(() => { supabase.from('members').select('id,first_name,last_name').then(({ data }) => setMembers((data as any) ?? [])); }, []);

  if (!user || (!roles.includes('super_admin') && !roles.includes('community_admin')))
    return <div className="p-6 text-center"><p className="text-zinc-500">Admin access required.</p></div>;

  const generateSlug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const submit = async (e: React.FormEvent) => { e.preventDefault(); setError(''); setLoading(true);
    try { const body: any = { name, slug }; if (adminId) body.admin_id = adminId;
      const { error: err } = await supabase.from('communities').insert(body); if (err) throw new Error(err.message); router.push('/communities'); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Create failed'); } finally { setLoading(false); } };

  return (
    <div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">Create Community</h1>
      <form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <div><label className="block text-sm font-medium">Community Name *</label><input value={name} onChange={e => { setName(e.target.value); setSlug(generateSlug(e.target.value)); }} className="input mt-1" required /></div>
        <div><label className="block text-sm font-medium">Slug *</label><input value={slug} onChange={e => setSlug(e.target.value)} className="input mt-1" required /></div>
        <div><label className="block text-sm font-medium">Community Admin (optional)</label><select value={adminId} onChange={e => setAdminId(e.target.value)} className="input"><option value="">None</option>{members.map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}</select><p className="text-xs text-zinc-400 mt-1">This person can manage the community, families, and members.</p></div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading ? 'Creating...' : 'Create Community'}</button><button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button></div>
      </form>
    </div>
  );
}
