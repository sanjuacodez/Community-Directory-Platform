'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

export default function EditAnnouncementPage() {
  const router=useRouter();const p=useParams();const{user,roles}=useAuth();
  const[f,setF]=useState({title:'',content:'',image:''});const[init,setInit]=useState(true);const[error,setError]=useState('');const[loading,setLoading]=useState(false);
  useEffect(()=>{supabase.from('announcements').select('*').eq('id',p.id).single().then(({data})=>{if(data){setF({title:data.title,content:data.content,image:data.image??''});setInit(false);}});},[p.id]);
  if(!user||!roles.includes('super_admin'))return<div className="p-6 text-center"><p>Admin only.</p></div>;if(init)return<p>Loading...</p>;
  const s=(k:string,v:string)=>setF(p=>({...p,[k]:v}));
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError('');setLoading(true);
    try{const{error:err}=await supabase.from('announcements').update(f).eq('id',p.id);if(err)throw new Error(err.message);router.push('/announcements');}
    catch(err:any){setError(err.message)}finally{setLoading(false)}};
  return(<div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">Edit Announcement</h1><form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
    <div><label className="block text-sm font-medium">Title</label><input value={f.title} onChange={e=>s('title',e.target.value)} className="input" required/></div>
    <div><label className="block text-sm font-medium">Content</label><textarea value={f.content} onChange={e=>s('content',e.target.value)} className="input" rows={5} required/></div>
    <div><label className="block text-sm font-medium">Image URL</label><input value={f.image} onChange={e=>s('image',e.target.value)} className="input"/></div>
    {error&&<p className="text-sm text-red-600">{error}</p>}
    <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading?'Saving...':'Save'}</button><button type="button" onClick={()=>router.back()} className="btn-secondary">Cancel</button></div>
  </form></div>);
}
