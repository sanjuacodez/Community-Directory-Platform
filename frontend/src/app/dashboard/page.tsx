'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

export default function DashboardPage() {
  const { user, roles } = useAuth();
  const [stats, setStats] = useState<any>({});
  const [bloodGroups, setBloodGroups] = useState<any[]>([]);
  const [professions, setProfessions] = useState<any[]>([]);

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
      supabase.rpc('get_blood_group_stats'),
      supabase.rpc('get_profession_stats'),
    ]).then(([m, f, c, a, e, b, j, o, bg, prof]) => {
      setStats({ members: m.count, families: f.count, communities: c.count, announcements: a.count, events: e.count, businesses: b.count, jobs: j.count, obituaries: o.count });
      setBloodGroups((bg as any)?.data ?? []);
      setProfessions((prof as any)?.data ?? []);
    });
  }, [user]);

  if (!user || !roles.includes('super_admin')) return <div className="p-6 text-center"><p>Admin access required.</p></div>;

  const cards = [{ l: 'Members', v: stats.members }, { l: 'Families', v: stats.families }, { l: 'Communities', v: stats.communities }, { l: 'News', v: stats.announcements }, { l: 'Events', v: stats.events }, { l: 'Businesses', v: stats.businesses }, { l: 'Jobs', v: stats.jobs }, { l: 'Obituaries', v: stats.obituaries }];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex gap-2">
        <a href="/admin/roles" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50">Manage Roles</a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{cards.map(c => (<div key={c.l} className="rounded-xl border border-zinc-200 bg-white p-4"><p className="text-2xl font-bold">{c.v ?? '-'}</p><p className="text-sm text-zinc-500">{c.l}</p></div>))}</div>

      {bloodGroups.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="font-semibold mb-4">Blood Group Distribution</h2>
          <div className="space-y-2">{bloodGroups.map((bg: any) => <div key={bg.blood_group} className="flex items-center gap-3"><span className="text-sm font-medium w-10">{bg.blood_group}</span><div className="flex-1 h-4 bg-zinc-100 rounded-full overflow-hidden"><div className="h-full bg-zinc-900 rounded-full" style={{ width: `${(bg.count / Math.max(...bloodGroups.map((b: any) => b.count))) * 100}%` }} /></div><span className="text-sm text-zinc-500 w-8 text-right">{bg.count}</span></div>)}</div>
        </div>
      )}

      {professions.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="font-semibold mb-4">Top Professions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{professions.map((p: any) => <div key={p.profession} className="rounded-lg border border-zinc-200 p-3"><p className="text-sm font-medium">{p.profession || 'Unknown'}</p><p className="text-xs text-zinc-500">{p.count} member(s)</p></div>)}</div>
        </div>
      )}
    </div>
  );
}
