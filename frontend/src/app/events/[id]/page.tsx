'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Event { id:string;title:string;description:string|null;event_date:string;location:string|null;image:string|null;community:{id:string;name:string};}

export default function EventDetailPage() {
  const p=useParams();const[e,setE]=useState<Event|null>(null);const[l,setL]=useState(true);
  useEffect(()=>{supabase.from('events').select('*, community:communities(id,name)').eq('id',p.id).single().then(({data})=>{setE(data as any);setL(false);});},[p.id]);
  if(l)return<p>Loading...</p>;if(!e)return<p>Not found.</p>;
  return(<div className="mx-auto max-w-2xl space-y-6"><h1 className="text-2xl font-bold">{e.title}</h1><div className="text-xs text-zinc-400 flex gap-2"><span>{new Date(e.event_date).toLocaleDateString()}</span>{e.location&&<><span>·</span><span>{e.location}</span></>}<span>·</span><span>{e.community?.name}</span></div>{e.image&&<img src={e.image} className="w-full rounded-xl object-cover max-h-96"/>}<div className="rounded-xl border border-zinc-200 bg-white p-6"><p className="text-zinc-700 whitespace-pre-wrap">{e.description}</p></div><Link href="/events" className="text-sm text-zinc-500 hover:text-zinc-700">← Back</Link></div>);
}
