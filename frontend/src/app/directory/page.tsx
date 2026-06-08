'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { useRouter } from 'next/navigation';

interface Member { id:string;first_name:string;last_name:string;gender:string;blood_group:string|null;profession:string|null;location:string|null;family:{id:string;name:string};community:{id:string;name:string};}

export default function DirectoryPage() {
  const {user}=useAuth();const router=useRouter();
  const[members,setMembers]=useState<Member[]>([]);const[search,setSearch]=useState('');const[blood,setBlood]=useState('');const[prof,setProf]=useState('');const[loc,setLoc]=useState('');const[loading,setLoading]=useState(true);
  const B=['A+','A-','B+','B-','AB+','AB-','O+','O-'];
  useEffect(()=>{if(!user){router.push('/login');return;}let q=supabase.from('members').select('*, family:families(id,name), community:communities(id,name)').neq('status','deleted').neq('visibility','private');
    if(search)q=q.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`);if(blood)q=q.eq('blood_group',blood);if(prof)q=q.ilike('profession',`%${prof}%`);if(loc)q=q.ilike('location',`%${loc}%`);
    q.order('created_at',{ascending:false}).then(({data})=>{setMembers((data as any)??[]);setLoading(false)});},[user,search,blood,prof,loc]);
  return(<div className="space-y-6"><h1 className="text-2xl font-bold">Member Directory</h1>
    <div className="flex flex-wrap gap-3"><input placeholder="Search by name..." value={search} onChange={e=>setSearch(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm w-full sm:w-64"/><select value={blood} onChange={e=>setBlood(e.target.value)} className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"><option value="">All Blood Groups</option>{B.map(b=><option key={b} value={b}>{b}</option>)}</select><input placeholder="Profession..." value={prof} onChange={e=>setProf(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"/><input placeholder="Location..." value={loc} onChange={e=>setLoc(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"/></div>
    {loading?<p className="text-zinc-500">Loading...</p>:members.length===0?<div className="rounded-xl border border-zinc-200 bg-white p-12 text-center"><p className="text-zinc-500">No members found.</p></div>:<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{members.map(m=>(<Link key={m.id} href={`/members/${m.id}`} className="rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-400 transition-colors"><div className="flex items-center gap-2 mb-2"><div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-sm font-semibold text-zinc-600">{m.first_name[0]}{m.last_name[0]}</div><div><h3 className="font-semibold">{m.first_name} {m.last_name}</h3><p className="text-xs text-zinc-500 capitalize">{m.gender}{m.blood_group&&` · ${m.blood_group}`}</p></div></div><div className="space-y-1 text-sm text-zinc-600">{m.profession&&<p>{m.profession}</p>}{m.location&&<p>{m.location}</p>}<p className="text-xs text-zinc-400">{m.family?.name} · {m.community?.name}</p></div></Link>))}</div>}</div>);
}
