'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

export default function MemberProfilePage() {
  const p=useParams();const{user}=useAuth();
  const[m,setM]=useState<any>(null);const[l,setL]=useState(true);

  useEffect(()=>{if(!user)return;
    supabase.from('members').select('*, family:families(*), community:communities(*)').eq('id',p.id).single().then(({data})=>{setM(data);setL(false);});
    supabase.from('member_relationships').select('*, related:members!member_relationships_related_member_id_fkey(first_name,last_name)').eq('member_id',p.id).then(({data})=>{if(data)setM((prev:any)=>({...prev,relationships:data}));});
  },[user,p.id]);

  if(!user)return<div className="p-6 text-center">Please login.</div>;
  if(l)return<p>Loading...</p>;if(!m)return<p>Not found.</p>;

  return(<div className="mx-auto max-w-2xl space-y-6"><div className="flex items-center justify-between"><h1 className="text-2xl font-bold">{m.first_name} {m.last_name}</h1><Link href={`/members/${m.id}/edit`} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800">Edit</Link></div>
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
      <Section title="Basic"><Field label="Gender" v={m.gender}/><Field label="Blood Group" v={m.blood_group}/><Field label="Location" v={m.location}/></Section>
      <Section title="Contact"><Field label="Email" v={m.email}/><Field label="Phone" v={m.phone}/></Section>
      <Section title="Professional"><Field label="Profession" v={m.profession}/><Field label="Organization" v={m.organization}/><Field label="Education" v={m.education}/></Section>
      <Section title="Family"><div>{m.family?.name}{m.family?.house_name&&` (${m.family.house_name})`}</div><Field label="Community" v={m.community?.name}/></Section>
      {m.relationships?.length>0&&<Section title="Relationships"><div className="space-y-1">{m.relationships.map((r:any,i:number)=><div key={i} className="text-sm">{r.relationship_type}: {r.related?.first_name} {r.related?.last_name}</div>)}</div></Section>}
    </div>
    <Link href="/members" className="text-sm text-zinc-500 hover:text-zinc-700">← Back to Members</Link>
  </div>);
}

function Section({title,children}:{title:string;children:React.ReactNode}){return<div><h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-2">{title}</h3><div className="space-y-1">{children}</div></div>;}
function Field({label,v}:{label:string;v:string|null}){if(!v)return null;return<p className="text-sm"><span className="text-zinc-500">{label}: </span><span className="capitalize">{v}</span></p>;}
