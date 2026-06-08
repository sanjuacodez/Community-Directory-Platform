'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

const TYPES=['father','mother','spouse','child'];

export default function MemberProfilePage() {
  const p=useParams();const{user}=useAuth();const router=useRouter();
  const[m,setM]=useState<any>(null);const[members,setMembers]=useState<any[]>([]);const[l,setL]=useState(true);
  const[showRelForm,setShowRelForm]=useState(false);const[relType,setRelType]=useState('spouse');const[relMemberId,setRelMemberId]=useState('');const[relError,setRelError]=useState('');

  useEffect(()=>{if(!user){router.push('/login');return;}
    supabase.from('members').select('*, family:families(*), community:communities(*)').eq('id',p.id).single().then(({data})=>{setM(data);setL(false);});
    supabase.from('members').select('id,first_name,last_name,family_id').neq('status','deleted').then(({data})=>setMembers((data as any)??[]));
  },[user,p.id]);

  const loadRelationships=async()=>{
    const{data}=await supabase.from('member_relationships').select('*, related:members!member_relationships_related_member_id_fkey(first_name,last_name)').eq('member_id',p.id);
    if(data)setM((prev:any)=>({...prev,relationships:data}));
  };

  useEffect(()=>{if(m)loadRelationships();},[m?.id]);

  const addRelationship=async(e:React.FormEvent)=>{e.preventDefault();setRelError('');
    try{const{error:err}=await supabase.from('member_relationships').insert({member_id:p.id,related_member_id:relMemberId,relationship_type:relType});if(err)throw new Error(err.message);setShowRelForm(false);setRelMemberId('');loadRelationships();}
    catch(err:any){setRelError(err.message)}};

  const deleteRelationship=async(id:string)=>{await supabase.from('member_relationships').delete().eq('id',id);loadRelationships();};

  if(l)return<p>Loading...</p>;if(!m)return<p>Not found.</p>;

  return(<div className="mx-auto max-w-2xl space-y-6"><div className="flex items-center justify-between"><h1 className="text-2xl font-bold">{m.first_name} {m.last_name}</h1><Link href={`/members/${m.id}/edit`} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800">Edit</Link></div>
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
      <Section title="Basic"><Field label="Gender" v={m.gender}/><Field label="DOB" v={m.date_of_birth?.split('T')[0]}/><Field label="Blood Group" v={m.blood_group}/><Field label="Location" v={m.location}/></Section>
      <Section title="Contact"><Field label="Email" v={m.email}/><Field label="Phone" v={m.phone}/></Section>
      <Section title="Professional"><Field label="Profession" v={m.profession}/><Field label="Organization" v={m.organization}/><Field label="Education" v={m.education}/></Section>
      <Section title="Family"><div className="text-sm">{m.family?.name}{m.family?.house_name&&` (${m.family.house_name})`}</div><Field label="Community" v={m.community?.name}/></Section>

      <Section title="Relationships">
        <div className="space-y-2">
          {m.relationships?.map((r:any)=>(<div key={r.id} className="flex items-center justify-between text-sm"><span className="capitalize"><Link href={`/members/${r.related_member_id}`} className="text-blue-600 hover:underline">{r.related?.first_name} {r.related?.last_name}</Link> — {r.relationship_type}</span><button onClick={()=>deleteRelationship(r.id)} className="text-red-500 hover:text-red-700 text-xs">Remove</button></div>))}
          {(!m.relationships||m.relationships.length===0)&&<p className="text-sm text-zinc-400">No relationships added.</p>}
        </div>
        {!showRelForm?<button onClick={()=>setShowRelForm(true)} className="text-sm text-blue-600 hover:underline mt-2">+ Add Relationship</button>:<form onSubmit={addRelationship} className="mt-3 space-y-2 border-t pt-3">
          <div className="flex gap-2">
            <select value={relType} onChange={e=>setRelType(e.target.value)} className="rounded border border-zinc-300 px-2 py-1 text-sm"><option value="father">Father</option><option value="mother">Mother</option><option value="spouse">Spouse</option><option value="child">Child</option></select>
            <select value={relMemberId} onChange={e=>setRelMemberId(e.target.value)} className="rounded border border-zinc-300 px-2 py-1 text-sm flex-1" required><option value="">Select member</option>{members.filter(mm=>mm.id!==m.id&&mm.family_id===m.family_id).map(mm=><option key={mm.id} value={mm.id}>{mm.first_name} {mm.last_name}</option>)}</select>
            <button type="submit" className="rounded bg-zinc-900 px-3 py-1 text-xs text-white hover:bg-zinc-800">Add</button>
            <button type="button" onClick={()=>setShowRelForm(false)} className="rounded border border-zinc-300 px-3 py-1 text-xs hover:bg-zinc-50">Cancel</button>
          </div>
          {relError&&<p className="text-xs text-red-600">{relError}</p>}
        </form>}
      </Section>
    </div>
    <Link href="/members" className="text-sm text-zinc-500 hover:text-zinc-700">← Back to Members</Link>
  </div>);
}

function Section({title,children}:{title:string;children:React.ReactNode}){return<div><h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-2">{title}</h3><div className="space-y-1">{children}</div></div>;}
function Field({label,v}:{label:string;v:string|null|undefined}){if(!v)return null;return<p className="text-sm"><span className="text-zinc-500">{label}: </span><span className="capitalize">{v}</span></p>;}
