'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ObituaryDetailPage() {
  const p=useParams();const[o,setO]=useState<any>(null);const[l,setL]=useState(true);
  useEffect(()=>{supabase.from('obituaries').select('*, community:communities(id,name), member:members(id,first_name,last_name)').eq('id',p.id).single().then(({data})=>{setO(data);setL(false)});},[p.id]);
  if(l)return<p>Loading...</p>;if(!o)return<p>Not found.</p>;
  return(<div className="mx-auto max-w-2xl space-y-6"><h1 className="text-2xl font-bold">{o.member?.first_name} {o.member?.last_name}</h1><div className="text-sm text-zinc-500 flex gap-2"><span>{new Date(o.date_of_death).toLocaleDateString()}</span><span>·</span><span>{o.community?.name}</span></div>{o.content&&<div className="rounded-xl border border-zinc-200 bg-white p-6"><p className="text-zinc-700 whitespace-pre-wrap">{o.content}</p></div>}<Link href="/obituaries" className="text-sm text-zinc-500 hover:text-zinc-700">← Back</Link></div>);
}
