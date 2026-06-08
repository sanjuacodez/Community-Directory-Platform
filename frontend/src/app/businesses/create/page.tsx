'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/stores/auth';
import { api } from '@/lib/api';

export default function CreateBusinessPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [communities, setCommunities] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [f, setF] = useState({ communityId: '', ownerMemberId: '', businessName: '', category: '', description: '', phone: '', email: '', location: '' });
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);

  useEffect(() => { if (token) { api<any[]>('/communities',{token}).then(setCommunities); api<any[]>('/members',{token}).then(setMembers); } }, [token]);
  if (!user) return <div className="p-6 text-center">Please login.</div>;

  const submit = async (e: React.FormEvent) => { e.preventDefault(); setError(''); setLoading(true);
    try { await api('/businesses',{method:'POST',token:token!,body:Object.fromEntries(Object.entries(f).filter(([_,v])=>v))}); router.push('/businesses'); }
    catch(err:any){setError(err.message)}finally{setLoading(false)} };
  return (
    <div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">Add Business</h1>
      <form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <div><label className="block text-sm font-medium">Community</label><select value={f.communityId} onChange={e=>setF({...f,communityId:e.target.value})} className="input" required><option value="">Select</option>{communities.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div><label className="block text-sm font-medium">Owner</label><select value={f.ownerMemberId} onChange={e=>setF({...f,ownerMemberId:e.target.value})} className="input" required><option value="">Select</option>{members.filter(m=>!f.communityId||m.communityId===f.communityId).map(m=><option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>)}</select></div>
        <div><label className="block text-sm font-medium">Business Name</label><input value={f.businessName} onChange={e=>setF({...f,businessName:e.target.value})} className="input" required /></div>
        <div><label className="block text-sm font-medium">Category</label><input value={f.category} onChange={e=>setF({...f,category:e.target.value})} className="input" /></div>
        <div><label className="block text-sm font-medium">Description</label><textarea value={f.description} onChange={e=>setF({...f,description:e.target.value})} className="input" rows={3} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm font-medium">Phone</label><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} className="input" /></div>
          <div><label className="block text-sm font-medium">Email</label><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} className="input" /></div>
        </div>
        <div><label className="block text-sm font-medium">Location</label><input value={f.location} onChange={e=>setF({...f,location:e.target.value})} className="input" /></div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading?'Creating...':'Create'}</button><button type="button" onClick={()=>router.back()} className="btn-secondary">Cancel</button></div>
      </form>
    </div>
  );
}
