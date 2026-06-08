'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/stores/auth';
import { api } from '@/lib/api';
export default function EditJobPage() {
  const router=useRouter(); const params=useParams(); const {token,user}=useAuth();
  const [f,setF]=useState({title:'',company:'',location:'',description:'',contactInformation:'',expiryDate:''});
  const [init,setInit]=useState(true); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  useEffect(()=>{if(!token)return;api<any>(`/jobs/${params.id}`,{token}).then(j=>{setF({title:j.title,company:j.company??'',location:j.location??'',description:j.description??'',contactInformation:j.contactInformation??'',expiryDate:j.expiryDate?.split('T')[0]??''});setInit(false)}).catch(e=>setError(e.message))},[token,params.id]);
  if(!user?.roles?.includes('super_admin'))return<div className="p-6 text-center"><p className="text-zinc-500">Super admin only.</p></div>;
  if(init)return<p className="text-zinc-500">Loading...</p>;
  const s=(k:string,v:string)=>setF(p=>({...p,[k]:v}));
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError('');setLoading(true);
    try{await api(`/jobs/${params.id}`,{method:'PATCH',token:token!,body:Object.fromEntries(Object.entries(f).filter(([_,v])=>v))});router.push('/jobs');}
    catch(err:any){setError(err.message)}finally{setLoading(false)}};
  return (<div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">Edit Job</h1><form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
    <div><label className="block text-sm font-medium">Title</label><input value={f.title} onChange={e=>s('title',e.target.value)} className="input" required /></div>
    <div><label className="block text-sm font-medium">Company</label><input value={f.company} onChange={e=>s('company',e.target.value)} className="input" /></div>
    <div><label className="block text-sm font-medium">Location</label><input value={f.location} onChange={e=>s('location',e.target.value)} className="input" /></div>
    <div><label className="block text-sm font-medium">Description</label><textarea value={f.description} onChange={e=>s('description',e.target.value)} className="input" rows={4} /></div>
    <div><label className="block text-sm font-medium">Contact Info</label><input value={f.contactInformation} onChange={e=>s('contactInformation',e.target.value)} className="input" /></div>
    <div><label className="block text-sm font-medium">Expiry Date</label><input type="date" value={f.expiryDate} onChange={e=>s('expiryDate',e.target.value)} className="input" /></div>
    {error&&<p className="text-sm text-red-600">{error}</p>}
    <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading?'Saving...':'Save'}</button><button type="button" onClick={()=>router.back()} className="btn-secondary">Cancel</button></div>
  </form></div>);
}
