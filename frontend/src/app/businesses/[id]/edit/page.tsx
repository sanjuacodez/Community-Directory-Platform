'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

export default function EditBusinessPage() {
  const router=useRouter();const p=useParams();const{user}=useAuth();
  const[f,setF]=useState<any>({});const[init,setInit]=useState(true);const[error,setError]=useState('');const[loading,setLoading]=useState(false);
  useEffect(()=>{supabase.from('businesses').select('*').eq('id',p.id).single().then(({data})=>{if(data){setF(data);setInit(false);}});},[p.id]);
  if(!user)return<div className="p-6">Please login.</div>;if(init)return<p>Loading...</p>;
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError('');setLoading(true);
    try{const{error:err}=await supabase.from('businesses').update({business_name:f.business_name,category:f.category,description:f.description,location:f.location}).eq('id',p.id);if(err)throw new Error(err.message);router.push('/businesses');}
    catch(err:any){setError(err.message)}finally{setLoading(false)}};
  return(<div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">Edit Business</h1><form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
    <div><label>Name</label><input value={f.business_name??''} onChange={e=>setF({...f,business_name:e.target.value})} className="input" required/></div>
    <div><label>Category</label><input value={f.category??''} onChange={e=>setF({...f,category:e.target.value})} className="input"/></div>
    <div><label>Description</label><textarea value={f.description??''} onChange={e=>setF({...f,description:e.target.value})} className="input" rows={3}/></div>
    <div><label>Location</label><input value={f.location??''} onChange={e=>setF({...f,location:e.target.value})} className="input"/></div>
    {error&&<p className="text-sm text-red-600">{error}</p>}
    <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading?'Saving...':'Save'}</button><button type="button" onClick={()=>router.back()} className="btn-secondary">Cancel</button></div>
  </form></div>);
}
