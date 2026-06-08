'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

const BLOOD=['','A+','A-','B+','B-','AB+','AB-','O+','O-'];

export default function CreateMemberPage() {
  const router=useRouter();const{user}=useAuth();
  const[communities,setCommunities]=useState<any[]>([]);const[families,setFamilies]=useState<any[]>([]);
  const[f,setF]=useState<any>({community_id:'',family_id:'',first_name:'',last_name:'',gender:'',date_of_birth:'',blood_group:'',email:'',phone:'',profession:'',organization:'',education:'',location:'',visibility:'community_only',is_deceased:false});
  const[error,setError]=useState('');const[loading,setLoading]=useState(false);
  useEffect(()=>{supabase.from('communities').select('id,name').then(({data})=>setCommunities((data as any)??[]));supabase.from('families').select('id,name,community_id').then(({data})=>setFamilies((data as any)??[]));},[]);
  if(!user)return<div className="rounded-xl border border-zinc-200 bg-white p-12 text-center"><p className="text-zinc-500">Please <a href="/login" className="text-zinc-900 font-medium hover:underline">login</a>.</p></div>;
  const s=(k:string,v:any)=>setF((p:any)=>({...p,[k]:v}));
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError('');setLoading(true);
    try{const body:any={...f};Object.keys(body).forEach(k=>{if(body[k]===''&&k!=='is_deceased'&&k!=='visibility')delete body[k];});
    const{error:err}=await supabase.from('members').insert(body);if(err)throw new Error(err.message);router.push('/members');}
    catch(err:any){setError(err.message)}finally{setLoading(false)}};
  return(<div className="mx-auto max-w-lg space-y-6"><h1 className="text-2xl font-bold">Add Member</h1><form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
    <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium">First Name *</label><input value={f.first_name} onChange={e=>s('first_name',e.target.value)} className="input" required/></div><div><label className="block text-sm font-medium">Last Name *</label><input value={f.last_name} onChange={e=>s('last_name',e.target.value)} className="input" required/></div></div>
    <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium">Community *</label><select value={f.community_id} onChange={e=>s('community_id',e.target.value)} className="input" required><option value="">Select</option>{communities.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div><label className="block text-sm font-medium">Family *</label><select value={f.family_id} onChange={e=>s('family_id',e.target.value)} className="input" required><option value="">Select</option>{families.filter(ff=>!f.community_id||ff.community_id===f.community_id).map(ff=><option key={ff.id} value={ff.id}>{ff.name}</option>)}</select></div></div>
    <div className="grid grid-cols-3 gap-3"><div><label className="block text-sm font-medium">Gender *</label><select value={f.gender} onChange={e=>s('gender',e.target.value)} className="input" required><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div><div><label className="block text-sm font-medium">Date of Birth</label><input type="date" value={f.date_of_birth} onChange={e=>s('date_of_birth',e.target.value)} className="input"/></div><div><label className="block text-sm font-medium">Blood Group</label><select value={f.blood_group} onChange={e=>s('blood_group',e.target.value)} className="input">{BLOOD.map(b=><option key={b} value={b}>{b||'None'}</option>)}</select></div></div>
    <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium">Email</label><input type="email" value={f.email??''} onChange={e=>s('email',e.target.value)} className="input"/></div><div><label className="block text-sm font-medium">Phone</label><input value={f.phone??''} onChange={e=>s('phone',e.target.value)} className="input"/></div></div>
    <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium">Profession</label><input value={f.profession??''} onChange={e=>s('profession',e.target.value)} className="input"/></div><div><label className="block text-sm font-medium">Organization</label><input value={f.organization??''} onChange={e=>s('organization',e.target.value)} className="input"/></div></div>
    <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium">Education</label><input value={f.education??''} onChange={e=>s('education',e.target.value)} className="input"/></div><div><label className="block text-sm font-medium">Location</label><input value={f.location??''} onChange={e=>s('location',e.target.value)} className="input"/></div></div>
    {error&&<p className="text-sm text-red-600">{error}</p>}
    <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading?'Creating...':'Create Member'}</button><button type="button" onClick={()=>router.back()} className="btn-secondary">Cancel</button></div>
  </form></div>);
}
