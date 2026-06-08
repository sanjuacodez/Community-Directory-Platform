'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/stores/auth';
import { api } from '@/lib/api';

export default function CreateEventPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [communities, setCommunities] = useState<any[]>([]);
  const [f, setF] = useState({ communityId: '', title: '', description: '', eventDate: '', location: '', image: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (token) api<any[]>('/communities', { token }).then(setCommunities).catch(() => {}); }, [token]);

  if (!user || !user.roles.includes('super_admin')) return <div className="p-6 text-center"><p className="text-zinc-500">Super admin only.</p></div>;

  const s = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setError(''); setLoading(true);
    try { await api('/events', { method: 'POST', token: token!, body: { ...f, description: f.description || undefined, location: f.location || undefined, image: f.image || undefined } }); router.push('/events'); }
    catch (err: any) { setError(err.message); } finally { setLoading(false); } };

  return (
    <div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">New Event</h1>
      <form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <div><label className="block text-sm font-medium">Community</label><select value={f.communityId} onChange={e=>s('communityId',e.target.value)} className="input" required><option value="">Select</option>{communities.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div><label className="block text-sm font-medium">Title</label><input value={f.title} onChange={e=>s('title',e.target.value)} className="input" required /></div>
        <div><label className="block text-sm font-medium">Description</label><textarea value={f.description} onChange={e=>s('description',e.target.value)} className="input" rows={3} /></div>
        <div><label className="block text-sm font-medium">Date</label><input type="date" value={f.eventDate} onChange={e=>s('eventDate',e.target.value)} className="input" required /></div>
        <div><label className="block text-sm font-medium">Location</label><input value={f.location} onChange={e=>s('location',e.target.value)} className="input" /></div>
        <div><label className="block text-sm font-medium">Image URL</label><input value={f.image} onChange={e=>s('image',e.target.value)} className="input" placeholder="https://..." /></div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading?'Creating...':'Create'}</button><button type="button" onClick={()=>router.back()} className="btn-secondary">Cancel</button></div>
      </form>
    </div>
  );
}
