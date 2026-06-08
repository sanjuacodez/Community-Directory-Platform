'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/stores/auth';
import { api } from '@/lib/api';

interface Community {
  id: string;
  name: string;
}

interface Family {
  id: string;
  name: string;
  communityId: string;
}

const BLOOD_GROUPS = [
  '', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-',
];
const GENDERS = ['', 'male', 'female', 'other'];
const VISIBILITY_OPTIONS = [
  'community_only', 'public', 'family_only', 'private',
];

export default function CreateMemberPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [form, setForm] = useState({
    communityId: '',
    familyId: '',
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    bloodGroup: '',
    email: '',
    phone: '',
    profession: '',
    organization: '',
    education: '',
    location: '',
    visibility: 'community_only',
    isDeceased: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      api<Community[]>('/communities', { token }).then(setCommunities).catch(() => {});
      api<Family[]>('/families', { token }).then(setFamilies).catch(() => {});
    }
  }, [token]);

  if (!user) {
    return <div className="p-6 text-center">Please login to create members.</div>;
  }

  const update = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const filteredFamilies = form.communityId
    ? families.filter((f) => f.communityId === form.communityId)
    : families;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body = { ...form };
      if (!body.dateOfBirth) delete (body as Record<string, unknown>).dateOfBirth;
      if (!body.bloodGroup) delete (body as Record<string, unknown>).bloodGroup;
      if (!body.email) delete (body as Record<string, unknown>).email;
      if (!body.phone) delete (body as Record<string, unknown>).phone;
      if (!body.profession) delete (body as Record<string, unknown>).profession;
      if (!body.organization) delete (body as Record<string, unknown>).organization;
      if (!body.education) delete (body as Record<string, unknown>).education;
      if (!body.location) delete (body as Record<string, unknown>).location;

      await api('/members', { method: 'POST', token: token!, body });
      router.push('/members');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Add Member</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <Field label="Community" required>
          <select value={form.communityId} onChange={(e) => update('communityId', e.target.value)} className="input" required>
            <option value="">Select community</option>
            {communities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Family" required>
          <select value={form.familyId} onChange={(e) => update('familyId', e.target.value)} className="input" required>
            <option value="">Select family</option>
            {filteredFamilies.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="First Name" required>
            <input type="text" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className="input" required />
          </Field>
          <Field label="Last Name" required>
            <input type="text" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className="input" required />
          </Field>
        </div>
        <Field label="Gender" required>
          <select value={form.gender} onChange={(e) => update('gender', e.target.value)} className="input" required>
            <option value="">Select gender</option>
            {GENDERS.filter(Boolean).map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date of Birth">
            <input type="date" value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} className="input" />
          </Field>
          <Field label="Blood Group">
            <select value={form.bloodGroup} onChange={(e) => update('bloodGroup', e.target.value)} className="input">
              {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg || 'None'}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email">
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="input" />
          </Field>
          <Field label="Phone">
            <input type="text" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Profession">
            <input type="text" value={form.profession} onChange={(e) => update('profession', e.target.value)} className="input" />
          </Field>
          <Field label="Organization">
            <input type="text" value={form.organization} onChange={(e) => update('organization', e.target.value)} className="input" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Education">
            <input type="text" value={form.education} onChange={(e) => update('education', e.target.value)} className="input" />
          </Field>
          <Field label="Location">
            <input type="text" value={form.location} onChange={(e) => update('location', e.target.value)} className="input" />
          </Field>
        </div>
        <Field label="Visibility">
          <select value={form.visibility} onChange={(e) => update('visibility', e.target.value)} className="input">
            {VISIBILITY_OPTIONS.map((v) => <option key={v} value={v}>{v.replace('_', ' ')}</option>)}
          </select>
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isDeceased} onChange={(e) => update('isDeceased', e.target.checked)} />
          Mark as deceased
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : 'Create Member'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
