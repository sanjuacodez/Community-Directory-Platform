'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

export default function EditJobPage() {
  const router=useRouter();const p=useParams();const{user}=useAuth();
  const[f,setF]=useState({title:'',company:'',location:'',description:'',contact_information:''});const[init,setInit]=useState(true);const[error,setError]=useState('');const[loading,setLoading]=useState(false);
  useEffect(()=>{supabase.from('jobs').select('*').eq('id',p.id).single().then(({data})=>{if(data){setF({title:data.title,company:data.company??'',location:data.location??'',description:data.description??'',contact_information:data.contact_information??''});setInit(false);}});},[p.id]);
  if(!user)return<div className="p-6">Please login.</div>;if(init)return<p>Loading...</p>;
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError('');setLoading(true);
    try{const{error:err}=await supabase.from('jobs').update(f).eq('id',p.id);if(err)throw new Error(err.message);router.push('/jobs');}
    catch(err:any){setError(err.message)}finally{setLoading(false)}};
  return(<div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">Edit Job</h1><form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
    <div><label>Title</label><input value={f.title} onChange={e=>setF({...f,title:e.target.value})} className="input" required/></div>
    <div><label>Company</label><input value={f.company} onChange={e=>setF({...f,company:e.target.value})} className="input"/></div>
    <div><label>Location</label><input value={f.location} onChange={e=>setF({...f,location:e.target.value})} className="input"/></div>
    <div><label>Description</label><textarea value={f.description} onChange={e=>setF({...f,description:e.target.value})} className="input" rows={3}/></div>
    <div><label>Contact Info</label><input value={f.contact_information} onChange={e=>setF({...f,contact_information:e.target.value})} className="input"/></div>
    {error&&<p className="text-sm text-red-600">{error}</p>}
    <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading?'Saving...':'Save'}</button><button type="button" onClick={()=>router.back()} className="btn-secondary">Cancel</button></div>
  </form></div>);
}
