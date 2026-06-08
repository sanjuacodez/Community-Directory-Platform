'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

export default function EditFamilyPage() {
  const router=useRouter();const p=useParams();const{user}=useAuth();
  const[f,setF]=useState({name:'',house_name:'',address:''});const[init,setInit]=useState(true);const[error,setError]=useState('');const[loading,setLoading]=useState(false);
  useEffect(()=>{supabase.from('families').select('*').eq('id',p.id).single().then(({data})=>{if(data){setF({name:data.name??'',house_name:data.house_name??'',address:data.address??''});setInit(false);}});},[p.id]);
  if(!user)return<div className="p-6">Please login.</div>;if(init)return<p>Loading...</p>;
  const s=(k:string,v:string)=>setF(p=>({...p,[k]:v}));
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError('');setLoading(true);
    try{const{error:err}=await supabase.from('families').update(f).eq('id',p.id);if(err)throw new Error(err.message);router.push('/families');}
    catch(err:any){setError(err.message)}finally{setLoading(false)}};
  return(<div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">Edit Family</h1><form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
    <div><label className="block text-sm font-medium">Name</label><input value={f.name} onChange={e=>s('name',e.target.value)} className="input" required/></div>
    <div><label className="block text-sm font-medium">House Name</label><input value={f.house_name} onChange={e=>s('house_name',e.target.value)} className="input"/></div>
    <div><label className="block text-sm font-medium">Address</label><input value={f.address} onChange={e=>s('address',e.target.value)} className="input"/></div>
    {error&&<p className="text-sm text-red-600">{error}</p>}
    <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading?'Saving...':'Save Changes'}</button><button type="button" onClick={()=>router.back()} className="btn-secondary">Cancel</button></div>
  </form></div>);
}
