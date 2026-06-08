'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Event { id:string;title:string;description:string|null;event_date:string;location:string|null;image:string|null;community:{id:string;name:string};}

export default function EventsPage() {
  const [items,setItems]=useState<Event[]>([]); const [l,setL]=useState(true);
  useEffect(()=>{supabase.from('events').select('*, community:communities(id,name)').order('event_date',{ascending:true}).then(({data})=>{setItems((data as any)??[]);setL(false);});},[]);
  if(l)return<p className="text-zinc-500 p-6">Loading...</p>;
  return(<div className="space-y-6"><h1 className="text-2xl font-bold">Events</h1>{items.length===0&&<div className="rounded-xl border border-zinc-200 bg-white p-12 text-center"><p className="text-zinc-500">No events yet.</p></div>}<div className="space-y-4">{items.map(e=>(<Link key={e.id} href={`/events/${e.id}`} className="block rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-400 transition-colors"><div className="flex gap-4">{e.image&&<img src={e.image} className="w-20 h-20 rounded-lg object-cover"/>}<div className="flex-1"><h2 className="font-semibold">{e.title}</h2><p className="text-sm text-zinc-500 mt-1 line-clamp-2">{e.description}</p><div className="flex gap-2 mt-2 text-xs text-zinc-400"><span>{new Date(e.event_date).toLocaleDateString()}</span>{e.location&&<><span>·</span><span>{e.location}</span></>}<span>·</span><span>{e.community?.name}</span></div></div></div></Link>))}</div></div>);
}
