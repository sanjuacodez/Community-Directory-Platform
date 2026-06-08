'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
interface Obituary { id: string; content: string | null; dateOfDeath: string; community: { id: string; name: string }; member: { id: string; firstName: string; lastName: string }; }
export default function ObituariesPage() {
  const [items,setItems]=useState<Obituary[]>([]); const [l,setL]=useState(true);
  useEffect(()=>{api<Obituary[]>('/obituaries').then(setItems).catch(()=>{}).finally(()=>setL(false))},[]);
  if(l)return<p className="text-zinc-500 p-6">Loading...</p>;
  return (<div className="space-y-6"><h1 className="text-2xl font-bold">Obituaries</h1>{items.length===0&&<div className="rounded-xl border border-zinc-200 bg-white p-12 text-center"><p className="text-zinc-500">No obituaries.</p></div>}<div className="space-y-4">{items.map(o=><Link key={o.id} href={`/obituaries/${o.id}`} className="block rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-400 transition-colors"><h2 className="font-semibold">{o.member.firstName} {o.member.lastName}</h2><div className="flex gap-2 mt-1 text-sm text-zinc-500"><span>{new Date(o.dateOfDeath).toLocaleDateString()}</span><span>·</span><span>{o.community.name}</span></div></Link>)}</div></div>);
}
