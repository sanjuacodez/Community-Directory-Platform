'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
interface Obituary { id: string; content: string | null; dateOfDeath: string; community: { id: string; name: string }; member: { id: string; firstName: string; lastName: string }; }
export default function ObituaryDetailPage() {
  const params=useParams(); const [o,setO]=useState<Obituary|null>(null); const [l,setL]=useState(true);
  useEffect(()=>{api<Obituary>(`/obituaries/${params.id}`).then(setO).catch(()=>{}).finally(()=>setL(false))},[params.id]);
  if(l)return<p className="text-zinc-500 p-6">Loading...</p>; if(!o)return<p className="text-zinc-500 p-6">Not found.</p>;
  return (<div className="mx-auto max-w-2xl space-y-6"><h1 className="text-2xl font-bold">{o.member.firstName} {o.member.lastName}</h1><div className="text-sm text-zinc-500 flex gap-2"><span>{new Date(o.dateOfDeath).toLocaleDateString()}</span><span>·</span><span>{o.community.name}</span></div>{o.content&&<div className="rounded-xl border border-zinc-200 bg-white p-6"><p className="text-zinc-700 whitespace-pre-wrap">{o.content}</p></div>}<Link href="/obituaries" className="text-sm text-zinc-500 hover:text-zinc-700">← Back to obituaries</Link></div>);
}
