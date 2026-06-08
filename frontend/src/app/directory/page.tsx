'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/stores/auth';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  bloodGroup: string | null;
  profession: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  visibility: string;
  family: { id: string; name: string };
  community: { id: string; name: string };
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function DirectoryPage() {
  const { token, user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [profession, setProfession] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (bloodGroup) params.set('bloodGroup', bloodGroup);
    if (profession) params.set('profession', profession);
    if (location) params.set('location', location);

    api<Member[]>(`/members?${params.toString()}`, { token })
      .then((data) => {
        setMembers(data.filter((m) => m.visibility !== 'private'));
        setError('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, search, bloodGroup, profession, location]);

  if (!user) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center">
        <p className="text-zinc-500">Please login to access the directory.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Member Directory</h1>

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm w-full sm:w-64"
        />
        <select
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">All Blood Groups</option>
          {BLOOD_GROUPS.map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter by profession..."
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Filter by location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      {loading && <p className="text-zinc-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Link
            key={member.id}
            href={`/members/${member.id}`}
            className="rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-400 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-sm font-semibold text-zinc-600">
                {member.firstName[0]}
                {member.lastName[0]}
              </div>
              <div>
                <h3 className="font-semibold">
                  {member.firstName} {member.lastName}
                </h3>
                <p className="text-xs text-zinc-500 capitalize">
                  {member.gender}
                  {member.bloodGroup && ` · ${member.bloodGroup}`}
                </p>
              </div>
            </div>
            <div className="space-y-1 text-sm text-zinc-600">
              {member.profession && (
                <p className="flex items-center gap-1">
                  <span className="text-zinc-400">💼</span> {member.profession}
                </p>
              )}
              {member.location && (
                <p className="flex items-center gap-1">
                  <span className="text-zinc-400">📍</span> {member.location}
                </p>
              )}
              <p className="flex items-center gap-1 text-xs text-zinc-400">
                <span>{member.family.name}</span>
                <span>·</span>
                <span>{member.community.name}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>

      {!loading && members.length === 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
          <p className="text-zinc-500">No members found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
