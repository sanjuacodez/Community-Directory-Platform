'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface A {id:string;title:string;content:string;image:string|null;published_at:string;community:{id:string;name:string};}
export default function Page() {
  const[items,setItems]=useState<A[]>([]);const[l,setL]=useState(true);
  useEffect(()=>{supabase.from('announcements').select('*, community:communities(id,name)').order('published_at',{ascending:false}).then(({data})=>{setItems((data as any)??[]);setL(false)});},[]);
  if(l)return<p className="text-zinc-500 p-6">Loading...</p>;
  return(<div className="space-y-6"><h1 className="text-2xl font-bold">Announcements</h1>{items.length===0&&<div className="rounded-xl border border-zinc-200 bg-white p-12 text-center"><p className="text-zinc-500">No announcements yet.</p></div>}<div className="space-y-4">{items.map(a=>(<Link key={a.id} href={`/announcements/${a.id}`} className="block rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-400 transition-colors"><div className="flex items-start gap-4">{a.image&&<img src={a.image} className="w-20 h-20 rounded-lg object-cover"/>}<div className="flex-1"><h2 className="font-semibold">{a.title}</h2><p className="text-sm text-zinc-500 mt-1 line-clamp-2">{a.content}</p><div className="flex gap-2 mt-2 text-xs text-zinc-400"><span>{a.community?.name}</span><span>·</span><span>{new Date(a.published_at).toLocaleDateString()}</span></div></div></div></Link>))}</div></div>);
}
