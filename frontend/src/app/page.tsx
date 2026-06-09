import Link from 'next/link';

const cards = [
  { href: '/families', title: 'Families', desc: 'Browse and manage family records', icon: '👨‍👩‍👧‍👦' },
  { href: '/members', title: 'Members', desc: 'View and manage community members', icon: '👤' },
  { href: '/directory', title: 'Directory', desc: 'Search members by profession, blood group & more', icon: '🔍' },
  { href: '/announcements', title: 'Announcements', desc: 'Stay updated with community news', icon: '📢' },
  { href: '/events', title: 'Events', desc: 'Upcoming community events', icon: '📅' },
  { href: '/businesses', title: 'Businesses', desc: 'Local business directory', icon: '🏪' },
  { href: '/jobs', title: 'Jobs', desc: 'Job opportunities within the community', icon: '💼' },
  { href: '/obituaries', title: 'Obituaries', desc: 'Remembering our community members', icon: '🕊️' },
];

export default function Home() {
  return (
    <div>
      <div className="card" style={{ textAlign: 'center', marginBottom: '2rem', padding: '3rem 1.5rem' }}>
        <img src="/logo.svg" alt="" width="56" height="56" style={{ margin: '0 auto 1rem' }} />
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, margin: 0 }}>CommunityHub</h1>
        <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-muted)', maxWidth: 500, margin: '0.5rem auto 0' }}>
          Your central platform for managing families, members, and community activities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <Link key={c.href} href={c.href} className="card no-underline hover:border-[var(--color-primary)] transition-all" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{c.icon}</div>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 0.25rem' }}>{c.title}</h2>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: 0 }}>{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
