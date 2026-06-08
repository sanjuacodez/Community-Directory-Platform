'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/stores/auth';
import { api } from '@/lib/api';
export default function CreateObituaryPage() {
  const router=useRouter(); const {token,user}=useAuth();
  const [communities,setCommunities]=useState<any[]>([]); const [members,setMembers]=useState<any[]>([]);
  const [f,setF]=useState({communityId:'',memberId:'',content:'',dateOfDeath:''});
  const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  useEffect(()=>{if(token){api<any[]>('/communities',{token}).then(setCommunities);api<any[]>('/members',{token}).then(setMembers);}},[token]);
  if(!user)return<div className="p-6 text-center">Please login.</div>;
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError('');setLoading(true);
    try{await api('/obituaries',{method:'POST',token:token!,body:{...f,content:f.content||undefined}});router.push('/obituaries');}
    catch(err:any){setError(err.message)}finally{setLoading(false)}};
  const s=(k:string,v:string)=>setF(p=>({...p,[k]:v}));
  return (<div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">Add Obituary</h1><form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
    <div><label className="block text-sm font-medium">Community</label><select value={f.communityId} onChange={e=>s('communityId',e.target.value)} className="input" required><option value="">Select</option>{communities.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
    <div><label className="block text-sm font-medium">Member</label><select value={f.memberId} onChange={e=>s('memberId',e.target.value)} className="input" required><option value="">Select</option>{members.filter(m=>!f.communityId||m.communityId===f.communityId).map(m=><option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>)}</select></div>
    <div><label className="block text-sm font-medium">Date of Death</label><input type="date" value={f.dateOfDeath} onChange={e=>s('dateOfDeath',e.target.value)} className="input" required /></div>
    <div><label className="block text-sm font-medium">Content</label><textarea value={f.content} onChange={e=>s('content',e.target.value)} className="input" rows={4} /></div>
    {error&&<p className="text-sm text-red-600">{error}</p>}
    <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading?'Creating...':'Create'}</button><button type="button" onClick={()=>router.back()} className="btn-secondary">Cancel</button></div>
  </form></div>);
}
