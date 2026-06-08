'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/stores/auth';
import { api } from '@/lib/api';

interface MemberDetail {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string | null;
  bloodGroup: string | null;
  email: string | null;
  phone: string | null;
  profession: string | null;
  organization: string | null;
  education: string | null;
  location: string | null;
  profileImage: string | null;
  isDeceased: boolean;
  visibility: string;
  status: string;
  family: { id: string; name: string; houseName: string | null };
  community: { id: string; name: string };
  relationshipsAs: {
    relationshipType: string;
    relatedMember: { id: string; firstName: string; lastName: string };
  }[];
  relatedToAs: {
    relationshipType: string;
    member: { id: string; firstName: string; lastName: string };
  }[];
}

export default function MemberProfilePage() {
  const params = useParams();
  const { token, user } = useAuth();
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    api<MemberDetail>(`/members/${params.id}`, { token })
      .then((data) => {
        setMember(data);
        setError('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, params.id]);

  if (!user) {
    return <div className="p-6 text-center">Please login.</div>;
  }

  if (loading) return <p className="text-zinc-500">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!member) return <p className="text-zinc-500">Member not found.</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {member.firstName} {member.lastName}
        </h1>
        <Link
          href={`/members/${member.id}/edit`}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
        >
          Edit
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
        <Section title="Basic Information">
          <Field label="Gender" value={member.gender} />
          <Field label="Date of Birth" value={member.dateOfBirth} />
          <Field label="Blood Group" value={member.bloodGroup} />
          {member.isDeceased && (
            <p className="text-red-600 font-medium">Deceased</p>
          )}
          <Field label="Visibility" value={member.visibility} />
        </Section>

        <Section title="Contact">
          <Field label="Email" value={member.email} />
          <Field label="Phone" value={member.phone} />
          <Field label="Location" value={member.location} />
        </Section>

        <Section title="Professional">
          <Field label="Profession" value={member.profession} />
          <Field label="Organization" value={member.organization} />
          <Field label="Education" value={member.education} />
        </Section>

        <Section title="Family">
          <div>
            <Link
              href={`/families`}
              className="text-blue-600 hover:underline"
            >
              {member.family.name}
            </Link>
            {member.family.houseName && (
              <span className="text-zinc-500">
                {' '}
                ({member.family.houseName})
              </span>
            )}
          </div>
          <Field label="Community" value={member.community.name} />
        </Section>

        {member.relationshipsAs.length > 0 && (
          <Section title="Relationships (as member)">
            {member.relationshipsAs.map((r, i) => (
              <div key={i} className="text-sm">
                <span className="capitalize">{r.relationshipType}</span> →{' '}
                <Link
                  href={`/members/${r.relatedMember.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {r.relatedMember.firstName} {r.relatedMember.lastName}
                </Link>
              </div>
            ))}
          </Section>
        )}

        {member.relatedToAs.length > 0 && (
          <Section title="Relationships (related to)">
            {member.relatedToAs.map((r, i) => (
              <div key={i} className="text-sm">
                <Link
                  href={`/members/${r.member.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {r.member.firstName} {r.member.lastName}
                </Link>{' '}
                → <span className="capitalize">{r.relationshipType}</span>
              </div>
            ))}
          </Section>
        )}
      </div>

      <Link href="/members" className="text-sm text-zinc-500 hover:text-zinc-700">
        ← Back to Members
      </Link>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-2">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  if (!value) return null;
  return (
    <p className="text-sm">
      <span className="text-zinc-500">{label}: </span>
      <span className="capitalize">{value}</span>
    </p>
  );
}
