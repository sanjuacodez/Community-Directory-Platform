'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/stores/auth';
import { api } from '@/lib/api';

interface Family {
  id: string;
  name: string;
}

interface Community {
  id: string;
  name: string;
}

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  bloodGroup: string | null;
  profession: string | null;
  location: string | null;
  status: string;
  family: Family;
  community: Community;
}

export default function MembersPage() {
  const { token, user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      api<Community[]>('/communities', { token })
        .then(setCommunities)
        .catch(() => {});
      api<Family[]>('/families', { token })
        .then(setFamilies)
        .catch(() => {});
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCommunity) params.set('communityId', selectedCommunity);
    if (selectedFamily) params.set('familyId', selectedFamily);
    if (search) params.set('search', search);

    api<Member[]>(`/members?${params.toString()}`, { token })
      .then((data) => {
        setMembers(data);
        setError('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, selectedCommunity, selectedFamily, search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Archive this member?')) return;
    try {
      await api(`/members/${id}`, { method: 'DELETE', token: token! });
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: 'deleted' } : m)),
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  if (!user) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center">
        <p>Please login to view members.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Members</h1>
        <Link
          href="/members/create"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
        >
          Add Member
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm w-64"
        />
        <select
          value={selectedCommunity}
          onChange={(e) => setSelectedCommunity(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">All Communities</option>
          {communities.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={selectedFamily}
          onChange={(e) => setSelectedFamily(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">All Families</option>
          {families.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-zinc-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="rounded-xl border border-zinc-200 bg-white p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/members/${member.id}`}
                    className="font-semibold hover:text-zinc-600"
                  >
                    {member.firstName} {member.lastName}
                  </Link>
                  <span className="text-xs text-zinc-400 capitalize">
                    ({member.gender})
                  </span>
                </div>
                <p className="text-sm text-zinc-500">
                  {member.profession && `${member.profession} · `}
                  {member.bloodGroup && `${member.bloodGroup} · `}
                  {member.family.name}
                </p>
                <p className="text-xs text-zinc-400">
                  {member.location && `${member.location} · `}
                  {member.community.name}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/members/${member.id}/edit`}
                  className="text-sm text-zinc-600 hover:text-zinc-900"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Archive
                </button>
              </div>
            </div>
          </div>
        ))}
        {!loading && members.length === 0 && (
          <p className="text-zinc-500">No members found.</p>
        )}
      </div>
    </div>
  );
}
