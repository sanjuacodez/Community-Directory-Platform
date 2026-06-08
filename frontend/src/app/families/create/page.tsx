'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

export default function CreateFamilyPage() {
  const router=useRouter();const{user}=useAuth();
  const[communities,setCommunities]=useState<any[]>([]);const[f,setF]=useState({community_id:'',name:'',house_name:'',address:''});const[error,setError]=useState('');const[loading,setLoading]=useState(false);
  useEffect(()=>{supabase.from('communities').select('id,name').then(({data})=>setCommunities((data as any)??[]));},[]);
  if(!user)return<div className="p-6">Please login.</div>;
  const s=(k:string,v:string)=>setF(p=>({...p,[k]:v}));
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError('');setLoading(true);
    try{const{error:err}=await supabase.from('families').insert(f);if(err)throw new Error(err.message);router.push('/families');}
    catch(err:any){setError(err.message)}finally{setLoading(false)}};
  return(<div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">Create Family</h1><form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
    <div><label className="block text-sm font-medium">Community</label><select value={f.community_id} onChange={e=>s('community_id',e.target.value)} className="input" required><option value="">Select</option>{communities.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
    <div><label className="block text-sm font-medium">Family Name</label><input value={f.name} onChange={e=>s('name',e.target.value)} className="input" required/></div>
    <div><label className="block text-sm font-medium">House Name</label><input value={f.house_name} onChange={e=>s('house_name',e.target.value)} className="input"/></div>
    <div><label className="block text-sm font-medium">Address</label><input value={f.address} onChange={e=>s('address',e.target.value)} className="input"/></div>
    {error&&<p className="text-sm text-red-600">{error}</p>}
    <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading?'Creating...':'Create Family'}</button><button type="button" onClick={()=>router.back()} className="btn-secondary">Cancel</button></div>
  </form></div>);
}
