'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function BusinessDetailPage() {
  const p=useParams();const[b,setB]=useState<any>(null);const[l,setL]=useState(true);
  useEffect(()=>{supabase.from('businesses').select('*, community:communities(id,name)').eq('id',p.id).single().then(({data})=>{setB(data);setL(false)});},[p.id]);
  if(l)return<p>Loading...</p>;if(!b)return<p>Not found.</p>;
  return(<div className="mx-auto max-w-2xl space-y-6"><h1 className="text-2xl font-bold">{b.business_name}</h1>{b.category&&<p className="text-xs text-zinc-400">{b.category} · {b.community?.name}</p>}<div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3">{b.description&&<p>{b.description}</p>}<div className="space-y-1 text-sm">{b.phone&&<p><span className="text-zinc-500">Phone: </span>{b.phone}</p>}{b.email&&<p><span className="text-zinc-500">Email: </span>{b.email}</p>}{b.location&&<p><span className="text-zinc-500">Location: </span>{b.location}</p>}</div></div><Link href="/businesses" className="text-sm text-zinc-500 hover:text-zinc-700">← Back</Link></div>);
}
