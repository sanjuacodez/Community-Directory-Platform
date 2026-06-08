'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

export default function EditMemberPage() {
  const router=useRouter();const p=useParams();const{user}=useAuth();
  const[f,setF]=useState<any>({});const[init,setInit]=useState(true);const[error,setError]=useState('');const[loading,setLoading]=useState(false);
  useEffect(()=>{supabase.from('members').select('*').eq('id',p.id).single().then(({data})=>{if(data){setF(data);setInit(false);}});},[p.id]);
  if(!user)return<div className="p-6">Please login.</div>;if(init)return<p>Loading...</p>;
  const s=(k:string,v:any)=>setF((p:any)=>({...p,[k]:v}));
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError('');setLoading(true);
    try{const{error:err}=await supabase.from('members').update({first_name:f.first_name,last_name:f.last_name,gender:f.gender,email:f.email,phone:f.phone,profession:f.profession,location:f.location}).eq('id',p.id);if(err)throw new Error(err.message);router.push('/members');}
    catch(err:any){setError(err.message)}finally{setLoading(false)}};
  return(<div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">Edit Member</h1><form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
    <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium">First Name</label><input value={f.first_name??''} onChange={e=>s('first_name',e.target.value)} className="input" required/></div><div><label className="block text-sm font-medium">Last Name</label><input value={f.last_name??''} onChange={e=>s('last_name',e.target.value)} className="input" required/></div></div>
    <div><label className="block text-sm font-medium">Gender</label><select value={f.gender??''} onChange={e=>s('gender',e.target.value)} className="input"><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
    <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium">Email</label><input type="email" value={f.email??''} onChange={e=>s('email',e.target.value)} className="input"/></div><div><label className="block text-sm font-medium">Phone</label><input value={f.phone??''} onChange={e=>s('phone',e.target.value)} className="input"/></div></div>
    <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium">Profession</label><input value={f.profession??''} onChange={e=>s('profession',e.target.value)} className="input"/></div><div><label className="block text-sm font-medium">Location</label><input value={f.location??''} onChange={e=>s('location',e.target.value)} className="input"/></div></div>
    {error&&<p className="text-sm text-red-600">{error}</p>}
    <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading?'Saving...':'Save Changes'}</button><button type="button" onClick={()=>router.back()} className="btn-secondary">Cancel</button></div>
  </form></div>);
}
