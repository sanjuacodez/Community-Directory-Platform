'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function JobDetailPage() {
  const p=useParams();const[j,setJ]=useState<any>(null);const[l,setL]=useState(true);
  useEffect(()=>{supabase.from('jobs').select('*, community:communities(id,name)').eq('id',p.id).single().then(({data})=>{setJ(data);setL(false)});},[p.id]);
  if(l)return<p>Loading...</p>;if(!j)return<p>Not found.</p>;
  return(<div className="mx-auto max-w-2xl space-y-6"><h1 className="text-2xl font-bold">{j.title}</h1><div className="text-sm text-zinc-500 flex gap-2">{j.company&&<span>{j.company}</span>}{j.location&&<><span>·</span><span>{j.location}</span></>}<span>·</span><span>{j.community?.name}</span></div><div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3">{j.description&&<p className="text-zinc-700 whitespace-pre-wrap">{j.description}</p>}{j.contact_information&&<div><h3 className="text-sm font-semibold text-zinc-400 mb-1">Contact</h3><p>{j.contact_information}</p></div>}</div><Link href="/jobs" className="text-sm text-zinc-500 hover:text-zinc-700">← Back</Link></div>);
}
