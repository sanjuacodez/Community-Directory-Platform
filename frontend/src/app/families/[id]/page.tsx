'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Member { id: string; first_name: string; last_name: string; gender: string; profession: string | null; blood_group: string | null; }

export default function FamilyDetailPage() {
  const p = useParams(); const [f, setF] = useState<any>(null); const [members, setMembers] = useState<Member[]>([]); const [l, setL] = useState(true);

  useEffect(() => {
    supabase.from('families').select('*, community:communities(id,name)').eq('id', p.id).single().then(({ data }) => { setF(data); setL(false); });
    supabase.from('members').select('id,first_name,last_name,gender,profession,blood_group').eq('family_id', p.id).neq('status', 'deleted').order('created_at', { ascending: false }).then(({ data }) => setMembers((data as any) ?? []));
  }, [p.id]);

  if (l) return <p className="text-zinc-500 p-6">Loading...</p>;
  if (!f) return <p className="text-zinc-500 p-6">Family not found.</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{f.name}</h1>
          <p className="text-sm text-zinc-500">{f.community?.name}</p>
        </div>
        <Link href={`/families/${f.id}/edit`} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800">Edit</Link>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
        {f.house_name && <p className="text-sm"><span className="text-zinc-500">House Name: </span>{f.house_name}</p>}
        {f.address && <p className="text-sm"><span className="text-zinc-500">Address: </span>{f.address}</p>}
        <p className="text-sm"><span className="text-zinc-500">Members: </span>{members.length}</p>
      </div>

      {members.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="font-semibold mb-4">Members ({members.length})</h2>
          <div className="space-y-2">
            {members.map(m => (
              <Link key={m.id} href={`/members/${m.id}`} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0 hover:bg-zinc-50 px-2 -mx-2 rounded">
                <div>
                  <span className="font-medium">{m.first_name} {m.last_name}</span>
                  <span className="text-xs text-zinc-400 ml-2 capitalize">{m.gender}</span>
                </div>
                <div className="text-sm text-zinc-500">{m.profession}{m.blood_group && ` · ${m.blood_group}`}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Link href="/families" className="text-sm text-zinc-500 hover:text-zinc-700">← Back to Families</Link>
        <Link href={`/members/create`} className="text-sm text-blue-600 hover:underline">+ Add Member</Link>
      </div>
    </div>
  );
}
