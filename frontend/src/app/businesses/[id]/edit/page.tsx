'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/stores/auth';
import { api } from '@/lib/api';

export default function EditBusinessPage() {
  const router = useRouter(); const params = useParams();
  const { token, user } = useAuth();
  const [f, setF] = useState({ businessName: '', category: '', description: '', phone: '', email: '', location: '' });
  const [init, setInit] = useState(true); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);

  useEffect(() => { if (!token) return; api<any>(`/businesses/${params.id}`,{token}).then(b=>{setF({businessName:b.businessName,category:b.category??'',description:b.description??'',phone:b.phone??'',email:b.email??'',location:b.location??''});setInit(false)}).catch(e=>setError(e.message)); }, [token, params.id]);
  if (!user) return <div className="p-6 text-center">Please login.</div>;
  if (init) return <p className="text-zinc-500">Loading...</p>;

  const submit = async (e: React.FormEvent) => { e.preventDefault(); setError(''); setLoading(true);
    try { await api(`/businesses/${params.id}`,{method:'PATCH',token:token!,body:Object.fromEntries(Object.entries(f).filter(([_,v])=>v))}); router.push('/businesses'); }
    catch(err:any){setError(err.message)}finally{setLoading(false)} };
  return (
    <div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">Edit Business</h1>
      <form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <div><label className="block text-sm font-medium">Business Name</label><input value={f.businessName} onChange={e=>setF({...f,businessName:e.target.value})} className="input" required /></div>
        <div><label className="block text-sm font-medium">Category</label><input value={f.category} onChange={e=>setF({...f,category:e.target.value})} className="input" /></div>
        <div><label className="block text-sm font-medium">Description</label><textarea value={f.description} onChange={e=>setF({...f,description:e.target.value})} className="input" rows={3} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm font-medium">Phone</label><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} className="input" /></div>
          <div><label className="block text-sm font-medium">Email</label><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} className="input" /></div>
        </div>
        <div><label className="block text-sm font-medium">Location</label><input value={f.location} onChange={e=>setF({...f,location:e.target.value})} className="input" /></div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading?'Saving...':'Save'}</button><button type="button" onClick={()=>router.back()} className="btn-secondary">Cancel</button></div>
      </form>
    </div>
  );
}
