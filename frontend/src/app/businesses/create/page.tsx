'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

export default function CreateBusinessPage() {
  const router=useRouter();const{user,roles}=useAuth();const[comms,setComms]=useState<any[]>([]);const[members,setMembers]=useState<any[]>([]);
  const[f,setF]=useState<any>({community_id:'',owner_member_id:'',business_name:'',category:'',description:'',phone:'',email:'',location:''});const[error,setError]=useState('');const[loading,setLoading]=useState(false);
  useEffect(()=>{supabase.from('communities').select('id,name').then(({data})=>setComms((data as any)??[]));supabase.from('members').select('id,first_name,last_name,community_id').then(({data})=>setMembers((data as any)??[]));},[]);
  if(!user)return<div className="p-6 text-center">Please login.</div>;
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError('');setLoading(true);
    try{const{error:err}=await supabase.from('businesses').insert(Object.fromEntries(Object.entries(f).filter(([_,v])=>v)));if(err)throw new Error(err.message);router.push('/businesses');}
    catch(err:any){setError(err.message)}finally{setLoading(false)}};
  return(<div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">Add Business</h1><form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
    <div><label className="block text-sm font-medium">Community</label><select value={f.community_id} onChange={e=>setF({...f,community_id:e.target.value})} className="input" required><option value="">Select</option>{comms.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
    <div><label className="block text-sm font-medium">Owner Member</label><select value={f.owner_member_id} onChange={e=>setF({...f,owner_member_id:e.target.value})} className="input" required><option value="">Select</option>{members.filter(m=>!f.community_id||m.community_id===f.community_id).map(m=><option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}</select></div>
    <div><label className="block text-sm font-medium">Business Name</label><input value={f.business_name} onChange={e=>setF({...f,business_name:e.target.value})} className="input" required/></div>
    <div><label className="block text-sm font-medium">Category</label><input value={f.category} onChange={e=>setF({...f,category:e.target.value})} className="input"/></div>
    <div><label className="block text-sm font-medium">Description</label><textarea value={f.description} onChange={e=>setF({...f,description:e.target.value})} className="input" rows={3}/></div>
    <div><label className="block text-sm font-medium">Location</label><input value={f.location} onChange={e=>setF({...f,location:e.target.value})} className="input"/></div>
    {error&&<p className="text-sm text-red-600">{error}</p>}
    <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading?'Creating...':'Create'}</button><button type="button" onClick={()=>router.back()} className="btn-secondary">Cancel</button></div>
  </form></div>);
}
