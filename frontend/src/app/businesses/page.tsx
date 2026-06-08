'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function BusinessesPage() {
  const[items,setItems]=useState<any[]>([]);const[l,setL]=useState(true);
  useEffect(()=>{supabase.from('businesses').select('*, community:communities(id,name)').order('created_at',{ascending:false}).then(({data})=>{setItems((data as any)??[]);setL(false);});},[]);
  if(l)return<p>Loading...</p>;
  return(<div className="space-y-6"><h1 className="text-2xl font-bold">Business Directory</h1>{items.length===0&&<div className="rounded-xl border border-zinc-200 bg-white p-12 text-center"><p>No businesses listed.</p></div>}<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map(b=>(<Link key={b.id} href={`/businesses/${b.id}`} className="rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-400 transition-colors"><h2 className="font-semibold">{b.business_name}</h2>{b.category&&<p className="text-xs text-zinc-400 mt-1">{b.category}</p>}{b.description&&<p className="text-sm text-zinc-500 mt-1 line-clamp-2">{b.description}</p>}{b.location&&<p className="text-xs text-zinc-500 mt-1">{b.location}</p>}<p className="text-xs text-zinc-400 mt-1">{b.community?.name}</p></Link>))}</div></div>);
}
