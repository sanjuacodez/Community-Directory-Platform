'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

export default function EditObituaryPage() {
  const router=useRouter();const p=useParams();const{user}=useAuth();
  const[f,setF]=useState({content:'',date_of_death:''});const[init,setInit]=useState(true);const[error,setError]=useState('');const[loading,setLoading]=useState(false);
  useEffect(()=>{supabase.from('obituaries').select('*').eq('id',p.id).single().then(({data})=>{if(data){setF({content:data.content??'',date_of_death:data.date_of_death?.split('T')[0]??''});setInit(false);}});},[p.id]);
  if(!user)return<div className="p-6">Please login.</div>;if(init)return<p>Loading...</p>;
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError('');setLoading(true);
    try{const{error:err}=await supabase.from('obituaries').update(f).eq('id',p.id);if(err)throw new Error(err.message);router.push('/obituaries');}
    catch(err:any){setError(err.message)}finally{setLoading(false)}};
  return(<div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">Edit Obituary</h1><form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
    <div><label>Date</label><input type="date" value={f.date_of_death} onChange={e=>setF({...f,date_of_death:e.target.value})} className="input" required/></div>
    <div><label>Content</label><textarea value={f.content} onChange={e=>setF({...f,content:e.target.value})} className="input" rows={4}/></div>
    {error&&<p className="text-sm text-red-600">{error}</p>}
    <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading?'Saving...':'Save'}</button><button type="button" onClick={()=>router.back()} className="btn-secondary">Cancel</button></div>
  </form></div>);
}
