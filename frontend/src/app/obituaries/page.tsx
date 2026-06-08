'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ObituariesPage() {
  const[items,setItems]=useState<any[]>([]);const[l,setL]=useState(true);
  useEffect(()=>{supabase.from('obituaries').select('*, community:communities(id,name), member:members(id,first_name,last_name)').order('date_of_death',{ascending:false}).then(({data})=>{setItems((data as any)??[]);setL(false);});},[]);
  if(l)return<p>Loading...</p>;
  return(<div className="space-y-6"><h1 className="text-2xl font-bold">Obituaries</h1>{items.length===0&&<div className="rounded-xl border border-zinc-200 bg-white p-12 text-center"><p>No obituaries.</p></div>}<div className="space-y-4">{items.map(o=><Link key={o.id} href={`/obituaries/${o.id}`} className="block rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-400 transition-colors"><h2 className="font-semibold">{o.member?.first_name} {o.member?.last_name}</h2><div className="flex gap-2 mt-1 text-sm text-zinc-500"><span>{new Date(o.date_of_death).toLocaleDateString()}</span><span>·</span><span>{o.community?.name}</span></div></Link>)}</div></div>);
}
