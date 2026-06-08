'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

export default function CreateJobPage() {
  const router=useRouter();const{user,roles}=useAuth();const[comms,setComms]=useState<any[]>([]);
  const[f,setF]=useState({community_id:'',title:'',company:'',location:'',description:'',contact_information:'',expiry_date:''});const[error,setError]=useState('');const[loading,setLoading]=useState(false);
  useEffect(()=>{supabase.from('communities').select('id,name').then(({data})=>setComms((data as any)??[]));},[]);
  if(!user||!roles.includes('super_admin'))return<div className="p-6 text-center"><p>Admin only.</p></div>;
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError('');setLoading(true);
    try{const{error:err}=await supabase.from('jobs').insert(Object.fromEntries(Object.entries(f).filter(([_,v])=>v)));if(err)throw new Error(err.message);router.push('/jobs');}
    catch(err:any){setError(err.message)}finally{setLoading(false)}};
  return(<div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">Post Job</h1><form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
    <div><label className="block text-sm font-medium">Community</label><select value={f.community_id} onChange={e=>setF({...f,community_id:e.target.value})} className="input" required><option value="">Select</option>{comms.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
    <div><label className="block text-sm font-medium">Title</label><input value={f.title} onChange={e=>setF({...f,title:e.target.value})} className="input" required/></div>
    <div><label className="block text-sm font-medium">Company</label><input value={f.company} onChange={e=>setF({...f,company:e.target.value})} className="input"/></div>
    <div><label className="block text-sm font-medium">Location</label><input value={f.location} onChange={e=>setF({...f,location:e.target.value})} className="input"/></div>
    <div><label className="block text-sm font-medium">Description</label><textarea value={f.description} onChange={e=>setF({...f,description:e.target.value})} className="input" rows={4}/></div>
    <div><label className="block text-sm font-medium">Contact Info</label><input value={f.contact_information} onChange={e=>setF({...f,contact_information:e.target.value})} className="input"/></div>
    {error&&<p className="text-sm text-red-600">{error}</p>}
    <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading?'Creating...':'Post Job'}</button><button type="button" onClick={()=>router.back()} className="btn-secondary">Cancel</button></div>
  </form></div>);
}
