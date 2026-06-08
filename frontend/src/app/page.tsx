import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-zinc-200 bg-white p-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Community Directory Platform
        </h1>
        <p className="mt-2 text-zinc-600">
          A centralized platform for managing community families, members,
          relationships, announcements, events, and more.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/families"
          className="rounded-xl border border-zinc-200 bg-white p-6 hover:border-zinc-400 transition-colors"
        >
          <h2 className="font-semibold">Families</h2>
          <p className="mt-1 text-sm text-zinc-500">
            View and manage family records
          </p>
        </Link>
        <Link
          href="/members"
          className="rounded-xl border border-zinc-200 bg-white p-6 hover:border-zinc-400 transition-colors"
        >
          <h2 className="font-semibold">Members</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Browse and manage member directory
          </p>
        </Link>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 opacity-50">
          <h2 className="font-semibold">Directory</h2>
          <p className="mt-1 text-sm text-zinc-500">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
