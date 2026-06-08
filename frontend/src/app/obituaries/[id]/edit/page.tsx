'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/stores/auth';
import { api } from '@/lib/api';
export default function EditObituaryPage() {
  const router=useRouter(); const params=useParams(); const {token,user}=useAuth();
  const [f,setF]=useState({content:'',dateOfDeath:''});
  const [init,setInit]=useState(true); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  useEffect(()=>{if(!token)return;api<any>(`/obituaries/${params.id}`,{token}).then(o=>{setF({content:o.content??'',dateOfDeath:o.dateOfDeath?.split('T')[0]??''});setInit(false)}).catch(e=>setError(e.message))},[token,params.id]);
  if(!user)return<div className="p-6 text-center">Please login.</div>; if(init)return<p className="text-zinc-500">Loading...</p>;
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError('');setLoading(true);
    try{await api(`/obituaries/${params.id}`,{method:'PATCH',token:token!,body:{content:f.content||null,dateOfDeath:f.dateOfDeath?new Date(f.dateOfDeath).toISOString():undefined}});router.push('/obituaries');}
    catch(err:any){setError(err.message)}finally{setLoading(false)}};
  return (<div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">Edit Obituary</h1><form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
    <div><label className="block text-sm font-medium">Date of Death</label><input type="date" value={f.dateOfDeath} onChange={e=>setF({...f,dateOfDeath:e.target.value})} className="input" required /></div>
    <div><label className="block text-sm font-medium">Content</label><textarea value={f.content} onChange={e=>setF({...f,content:e.target.value})} className="input" rows={4} /></div>
    {error&&<p className="text-sm text-red-600">{error}</p>}
    <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading?'Saving...':'Save'}</button><button type="button" onClick={()=>router.back()} className="btn-secondary">Cancel</button></div>
  </form></div>);
}
