'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/stores/auth';
import { api } from '@/lib/api';

interface DashboardStats {
  members: number; families: number; communities: number;
  announcements: number; events: number; businesses: number; jobs: number; obituaries: number;
}

interface ChartItem { count: number; [key: string]: unknown; }

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bloodGroups, setBloodGroups] = useState<{ bloodGroup: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      api<DashboardStats>('/reports/dashboard', { token }),
      api<{ bloodGroup: string; count: number }[]>('/reports/blood-groups', { token }),
    ]).then(([d, b]) => { setStats(d); setBloodGroups(b); }).catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  if (!user || !user.roles.includes('super_admin')) {
    return <div className="p-6 text-center"><p className="text-zinc-500">Admin access required.</p></div>;
  }

  if (loading || !stats) return <p className="text-zinc-500 p-6">Loading...</p>;

  const cards = [
    { label: 'Members', value: stats.members, href: '/members' },
    { label: 'Families', value: stats.families, href: '/families' },
    { label: 'Communities', value: stats.communities },
    { label: 'Announcements', value: stats.announcements, href: '/announcements' },
    { label: 'Events', value: stats.events, href: '/events' },
    { label: 'Businesses', value: stats.businesses, href: '/businesses' },
    { label: 'Jobs', value: stats.jobs, href: '/jobs' },
    { label: 'Obituaries', value: stats.obituaries, href: '/obituaries' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-sm text-zinc-500">{c.label}</p>
          </div>
        ))}
      </div>

      {bloodGroups.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="font-semibold mb-4">Blood Group Distribution</h2>
          <div className="space-y-2">
            {bloodGroups.map((bg) => (
              <div key={bg.bloodGroup} className="flex items-center gap-3">
                <span className="text-sm font-medium w-10">{bg.bloodGroup}</span>
                <div className="flex-1 h-4 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-900 rounded-full" style={{ width: `${Math.min((bg.count / Math.max(...bloodGroups.map(b => b.count))) * 100, 100)}%` }} />
                </div>
                <span className="text-sm text-zinc-500 w-8 text-right">{bg.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
