'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/stores/auth';
import { api } from '@/lib/api';

interface MemberData {
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
  visibility: string;
  isDeceased: boolean;
}

const BLOOD_GROUPS = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['', 'male', 'female', 'other'];
const VISIBILITY = ['community_only', 'public', 'family_only', 'private'];

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const { token, user } = useAuth();
  const [form, setForm] = useState({
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
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    api<MemberData>(`/members/${params.id}`, { token })
      .then((member) => {
        setForm({
          firstName: member.firstName ?? '',
          lastName: member.lastName ?? '',
          gender: member.gender ?? '',
          dateOfBirth: member.dateOfBirth?.split('T')[0] ?? '',
          bloodGroup: member.bloodGroup ?? '',
          email: member.email ?? '',
          phone: member.phone ?? '',
          profession: member.profession ?? '',
          organization: member.organization ?? '',
          education: member.education ?? '',
          location: member.location ?? '',
          visibility: member.visibility ?? 'community_only',
          isDeceased: member.isDeceased ?? false,
        });
        setInitialLoad(false);
      })
      .catch((err) => setError(err.message));
  }, [token, params.id]);

  if (!user) return <div className="p-6 text-center">Please login.</div>;
  if (initialLoad) return <p className="text-zinc-500">Loading...</p>;

  const update = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body: Record<string, string | boolean | null> = {};
      for (const [key, value] of Object.entries(form)) {
        if (value !== '' && value !== null) {
          body[key] = value;
        }
      }
      await api(`/members/${params.id}`, { method: 'PATCH', token: token!, body });
      router.push('/members');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const f = (field: string) => (form as Record<string, unknown>)[field] as string;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Edit Member</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First Name">
            <input type="text" value={f('firstName')} onChange={(e) => update('firstName', e.target.value)} className="input" required />
          </Field>
          <Field label="Last Name">
            <input type="text" value={f('lastName')} onChange={(e) => update('lastName', e.target.value)} className="input" required />
          </Field>
        </div>
        <Field label="Gender">
          <select value={f('gender')} onChange={(e) => update('gender', e.target.value)} className="input" required>
            {GENDERS.filter(Boolean).map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date of Birth">
            <input type="date" value={f('dateOfBirth')} onChange={(e) => update('dateOfBirth', e.target.value)} className="input" />
          </Field>
          <Field label="Blood Group">
            <select value={f('bloodGroup')} onChange={(e) => update('bloodGroup', e.target.value)} className="input">
              {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg || 'None'}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email"><input type="email" value={f('email')} onChange={(e) => update('email', e.target.value)} className="input" /></Field>
          <Field label="Phone"><input type="text" value={f('phone')} onChange={(e) => update('phone', e.target.value)} className="input" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Profession"><input type="text" value={f('profession')} onChange={(e) => update('profession', e.target.value)} className="input" /></Field>
          <Field label="Organization"><input type="text" value={f('organization')} onChange={(e) => update('organization', e.target.value)} className="input" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Education"><input type="text" value={f('education')} onChange={(e) => update('education', e.target.value)} className="input" /></Field>
          <Field label="Location"><input type="text" value={f('location')} onChange={(e) => update('location', e.target.value)} className="input" /></Field>
        </div>
        <Field label="Visibility">
          <select value={f('visibility')} onChange={(e) => update('visibility', e.target.value)} className="input">
            {VISIBILITY.map((v) => <option key={v} value={v}>{v.replace('_', ' ')}</option>)}
          </select>
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isDeceased} onChange={(e) => update('isDeceased', e.target.checked)} />
          Mark as deceased
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
