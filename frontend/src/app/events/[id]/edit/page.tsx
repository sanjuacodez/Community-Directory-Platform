'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/stores/auth';
import { api } from '@/lib/api';

export default function EditEventPage() {
  const router = useRouter(); const params = useParams();
  const { token, user } = useAuth();
  const [f, setF] = useState({ title: '', description: '', eventDate: '', location: '', image: '' });
  const [loading, setLoading] = useState(false); const [initial, setInitial] = useState(true); const [error, setError] = useState('');

  useEffect(() => { if (!token) return;
    api<any>(`/events/${params.id}`, { token }).then(e => { setF({ title: e.title, description: e.description??'', eventDate: e.eventDate?.split('T')[0]??'', location: e.location??'', image: e.image??'' }); setInitial(false); }).catch(e=>setError(e.message));
  }, [token, params.id]);

  if (!user?.roles?.includes('super_admin')) return <div className="p-6 text-center"><p className="text-zinc-500">Super admin only.</p></div>;
  if (initial) return <p className="text-zinc-500">Loading...</p>;

  const s = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setError(''); setLoading(true);
    try { await api(`/events/${params.id}`, { method: 'PATCH', token: token!, body: { ...f, eventDate: f.eventDate?new Date(f.eventDate).toISOString():undefined, description: f.description||null, location: f.location||null, image: f.image||null } }); router.push('/events'); }
    catch (err: any) { setError(err.message); } finally { setLoading(false); } };

  return (
    <div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">Edit Event</h1>
      <form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <div><label className="block text-sm font-medium">Title</label><input value={f.title} onChange={e=>s('title',e.target.value)} className="input" required /></div>
        <div><label className="block text-sm font-medium">Description</label><textarea value={f.description} onChange={e=>s('description',e.target.value)} className="input" rows={3} /></div>
        <div><label className="block text-sm font-medium">Date</label><input type="date" value={f.eventDate} onChange={e=>s('eventDate',e.target.value)} className="input" required /></div>
        <div><label className="block text-sm font-medium">Location</label><input value={f.location} onChange={e=>s('location',e.target.value)} className="input" /></div>
        <div><label className="block text-sm font-medium">Image URL</label><input value={f.image} onChange={e=>s('image',e.target.value)} className="input" /></div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading?'Saving...':'Save'}</button><button type="button" onClick={()=>router.back()} className="btn-secondary">Cancel</button></div>
      </form>
    </div>
  );
}
