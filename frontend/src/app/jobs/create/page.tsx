'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/stores/auth';
import { api } from '@/lib/api';
export default function CreateJobPage() {
  const router = useRouter(); const { token, user } = useAuth();
  const [communities, setCommunities] = useState<any[]>([]);
  const [f,setF]=useState({ communityId:'', title:'', company:'', location:'', description:'', contactInformation:'', expiryDate:'' });
  const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  useEffect(()=>{if(token)api<any[]>('/communities',{token}).then(setCommunities);},[token]);
  if(!user?.roles?.includes('super_admin'))return<div className="p-6 text-center"><p className="text-zinc-500">Super admin only.</p></div>;
  const s=(k:string,v:string)=>setF(p=>({...p,[k]:v}));
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError('');setLoading(true);
    try{await api('/jobs',{method:'POST',token:token!,body:Object.fromEntries(Object.entries(f).filter(([_,v])=>v))});router.push('/jobs');}
    catch(err:any){setError(err.message)}finally{setLoading(false)}};
  return (<div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">Post Job</h1><form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
    <div><label className="block text-sm font-medium">Community</label><select value={f.communityId} onChange={e=>s('communityId',e.target.value)} className="input" required><option value="">Select</option>{communities.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
    <div><label className="block text-sm font-medium">Title</label><input value={f.title} onChange={e=>s('title',e.target.value)} className="input" required /></div>
    <div><label className="block text-sm font-medium">Company</label><input value={f.company} onChange={e=>s('company',e.target.value)} className="input" /></div>
    <div><label className="block text-sm font-medium">Location</label><input value={f.location} onChange={e=>s('location',e.target.value)} className="input" /></div>
    <div><label className="block text-sm font-medium">Description</label><textarea value={f.description} onChange={e=>s('description',e.target.value)} className="input" rows={4} /></div>
    <div><label className="block text-sm font-medium">Contact Info</label><input value={f.contactInformation} onChange={e=>s('contactInformation',e.target.value)} className="input" /></div>
    <div><label className="block text-sm font-medium">Expiry Date</label><input type="date" value={f.expiryDate} onChange={e=>s('expiryDate',e.target.value)} className="input" /></div>
    {error&&<p className="text-sm text-red-600">{error}</p>}
    <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading?'Creating...':'Post Job'}</button><button type="button" onClick={()=>router.back()} className="btn-secondary">Cancel</button></div>
  </form></div>);
}
