'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

export default function DashboardPage() {
  const { user, roles } = useAuth();
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('members').select('*', { count: 'exact', head: true }).neq('status', 'deleted'),
      supabase.from('families').select('*', { count: 'exact', head: true }).neq('status', 'deleted'),
      supabase.from('communities').select('*', { count: 'exact', head: true }).neq('status', 'deleted'),
      supabase.from('announcements').select('*', { count: 'exact', head: true }).neq('status', 'deleted'),
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('businesses').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('obituaries').select('*', { count: 'exact', head: true }),
    ]).then(([m, f, c, a, e, b, j, o]) => {
      setStats({ members:m.count,families:f.count,communities:c.count,announcements:a.count,events:e.count,businesses:b.count,jobs:j.count,obituaries:o.count });
    });
  }, [user]);

  if (!user || !roles.includes('super_admin')) return <div className="p-6 text-center"><p>Admin access required.</p></div>;
  if (!stats.members && stats.members !== 0) return <p className="text-zinc-500 p-6">Loading...</p>;

  const cards = [{l:'Members',v:stats.members},{l:'Families',v:stats.families},{l:'Communities',v:stats.communities},{l:'Announcements',v:stats.announcements},{l:'Events',v:stats.events},{l:'Businesses',v:stats.businesses},{l:'Jobs',v:stats.jobs},{l:'Obituaries',v:stats.obituaries}];
  return (<div className="space-y-6"><h1 className="text-2xl font-bold">Dashboard</h1><div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{cards.map(c=>(<div key={c.l} className="rounded-xl border border-zinc-200 bg-white p-4"><p className="text-2xl font-bold">{c.v??0}</p><p className="text-sm text-zinc-500">{c.l}</p></div>))}</div></div>);
}
