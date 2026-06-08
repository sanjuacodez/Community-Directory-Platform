'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

export default function CreateObituaryPage() {
  const router=useRouter();const{user}=useAuth();const[comms,setComms]=useState<any[]>([]);const[members,setMembers]=useState<any[]>([]);
  const[f,setF]=useState({community_id:'',member_id:'',content:'',date_of_death:''});const[error,setError]=useState('');const[loading,setLoading]=useState(false);
  useEffect(()=>{supabase.from('communities').select('id,name').then(({data})=>setComms((data as any)??[]));supabase.from('members').select('id,first_name,last_name,community_id').then(({data})=>setMembers((data as any)??[]));},[]);
  if(!user)return<div className="p-6 text-center">Please login.</div>;
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError('');setLoading(true);
    try{const{error:err}=await supabase.from('obituaries').insert(f);if(err)throw new Error(err.message);router.push('/obituaries');}
    catch(err:any){setError(err.message)}finally{setLoading(false)}};
  return(<div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">Add Obituary</h1><form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
    <div><label className="block text-sm font-medium">Community</label><select value={f.community_id} onChange={e=>setF({...f,community_id:e.target.value})} className="input" required><option value="">Select</option>{comms.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
    <div><label className="block text-sm font-medium">Member</label><select value={f.member_id} onChange={e=>setF({...f,member_id:e.target.value})} className="input" required><option value="">Select</option>{members.filter(m=>!f.community_id||m.community_id===f.community_id).map(m=><option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}</select></div>
    <div><label className="block text-sm font-medium">Date of Death</label><input type="date" value={f.date_of_death} onChange={e=>setF({...f,date_of_death:e.target.value})} className="input" required/></div>
    <div><label className="block text-sm font-medium">Content</label><textarea value={f.content} onChange={e=>setF({...f,content:e.target.value})} className="input" rows={4}/></div>
    {error&&<p className="text-sm text-red-600">{error}</p>}
    <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading?'Creating...':'Create'}</button><button type="button" onClick={()=>router.back()} className="btn-secondary">Cancel</button></div>
  </form></div>);
}
