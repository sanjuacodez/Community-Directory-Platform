'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Announcement { id: string; title: string; content: string; image: string|null; published_at: string; community: { id: string; name: string }; }

export default function DetailPage() {
  const p = useParams(); const [a,setA]=useState<Announcement|null>(null); const [l,setL]=useState(true);
  useEffect(()=>{supabase.from('announcements').select('*, community:communities(id,name)').eq('id',p.id).single().then(({data})=>{setA(data as any);setL(false)});},[p.id]);
  if(l)return<p className="text-zinc-500 p-6">Loading...</p>; if(!a)return<p className="text-zinc-500 p-6">Not found.</p>;
  return (<div className="mx-auto max-w-2xl space-y-6"><h1 className="text-2xl font-bold">{a.title}</h1><div className="text-xs text-zinc-400 flex gap-2"><span>{a.community?.name}</span><span>·</span><span>{new Date(a.published_at).toLocaleDateString()}</span></div>{a.image&&<img src={a.image} className="w-full rounded-xl object-cover max-h-96"/>}<div className="rounded-xl border border-zinc-200 bg-white p-6"><p className="text-zinc-700 whitespace-pre-wrap">{a.content}</p></div><Link href="/announcements" className="text-sm text-zinc-500 hover:text-zinc-700">← Back to announcements</Link></div>);
}
