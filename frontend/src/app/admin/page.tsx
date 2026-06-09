'use client';
import Link from 'next/link';
import { useAuth } from '@/stores/auth';

const sections = [
  { title: 'Content', items: [
    { href: '/announcements/create', label: '📢 New Announcement' },
    { href: '/events/create', label: '📅 New Event' },
    { href: '/businesses/create', label: '🏪 New Business' },
    { href: '/jobs/create', label: '💼 New Job' },
    { href: '/obituaries/create', label: '🕊️ New Obituary' },
  ]},
  { title: 'Management', items: [
    { href: '/communities/create', label: '🏘️ New Community' },
    { href: '/families/create', label: '👨‍👩‍👧‍👦 New Family' },
    { href: '/members/create', label: '👤 New Member' },
  ]},
  { title: 'Administration', items: [
    { href: '/admin/roles', label: '🔑 Manage Roles' },
    { href: '/dashboard', label: '📊 Dashboard' },
  ]},
];

export default function AdminPage() {
  const { user, roles } = useAuth();
  const isAdmin = roles.includes('super_admin') || roles.includes('community_admin');
  if (!isAdmin) return <div className="card text-center"><p style={{color:'var(--color-text-muted)'}}>Admin access required.</p></div>;

  return (
    <div style={{maxWidth:700,margin:'0 auto'}}>
      <h1 style={{fontSize:'var(--font-size-2xl)',fontWeight:700}}>Admin Panel</h1>
      <p style={{color:'var(--color-text-muted)',marginBottom:'1.5rem'}}>
        Logged in as <strong>{user?.email}</strong> ({roles.join(', ').replace(/_/g,' ')})
      </p>
      {sections.map(s => (
        <div key={s.title} style={{marginBottom:'1.5rem'}}>
          <h2 className="section-title">{s.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {s.items.map(i => (
              <Link key={i.href} href={i.href} className="card" style={{padding:'0.875rem 1.125rem',textDecoration:'none',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                {i.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
