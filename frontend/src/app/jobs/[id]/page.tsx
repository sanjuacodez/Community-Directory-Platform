'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
interface Job { id: string; title: string; company: string | null; location: string | null; description: string | null; contactInformation: string | null; community: { id: string; name: string }; }
export default function JobDetailPage() {
  const params = useParams(); const [j, setJ] = useState<Job | null>(null); const [l,setL]=useState(true);
  useEffect(()=>{api<Job>(`/jobs/${params.id}`).then(setJ).catch(()=>{}).finally(()=>setL(false))},[params.id]);
  if(l)return <p className="text-zinc-500 p-6">Loading...</p>;
  if(!j)return <p className="text-zinc-500 p-6">Not found.</p>;
  return (<div className="mx-auto max-w-2xl space-y-6"><h1 className="text-2xl font-bold">{j.title}</h1><div className="text-sm text-zinc-500 flex gap-2">{j.company&&<span>{j.company}</span>}{j.location&&<><span>·</span><span>{j.location}</span></>}<span>·</span><span>{j.community.name}</span></div><div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3">{j.description&&<p className="text-zinc-700 whitespace-pre-wrap">{j.description}</p>}{j.contactInformation&&<div><h3 className="text-sm font-semibold text-zinc-400 mb-1">Contact</h3><p className="text-zinc-700">{j.contactInformation}</p></div>}</div><Link href="/jobs" className="text-sm text-zinc-500 hover:text-zinc-700">← Back to jobs</Link></div>);
}
