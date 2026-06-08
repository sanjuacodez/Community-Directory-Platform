'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function JobsPage() {
  const[items,setItems]=useState<any[]>([]);const[l,setL]=useState(true);
  useEffect(()=>{supabase.from('jobs').select('*, community:communities(id,name)').order('created_at',{ascending:false}).then(({data})=>{setItems((data as any)??[]);setL(false);});},[]);
  if(l)return<p>Loading...</p>;
  return(<div className="space-y-6"><h1 className="text-2xl font-bold">Job Board</h1>{items.length===0&&<div className="rounded-xl border border-zinc-200 bg-white p-12 text-center"><p>No jobs posted.</p></div>}<div className="space-y-4">{items.map(j=><Link key={j.id} href={`/jobs/${j.id}`} className="block rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-400 transition-colors"><h2 className="font-semibold">{j.title}</h2><div className="flex gap-2 mt-1 text-sm text-zinc-500">{j.company&&<span>{j.company}</span>}{j.location&&<><span>·</span><span>{j.location}</span></>}<span>·</span><span>{j.community?.name}</span></div></Link>)}</div></div>);
}
