'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { ImageUpload } from '@/components/image-upload';
import { QuickAddMember } from '@/components/quick-add-member';

const BLOOD = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <div><label className="block text-sm font-medium" style={{marginBottom:2}}>{label} {required && '*'}</label>{children}</div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: '1.25rem', marginBottom: '0.75rem' }}>
      <h3 className="section-title" style={{ marginTop: 0, marginBottom: '0.75rem' }}>{title}</h3>
      {children}
    </div>
  );
}

export default function CreateMemberPage() {
  const router = useRouter(); const { user } = useAuth();
  const [communities, setCommunities] = useState<any[]>([]); const [families, setFamilies] = useState<any[]>([]);
  const [existingMembers, setExistingMembers] = useState<any[]>([]);
  const [f, setF] = useState<any>({ community_id: '', family_id: '', first_name: '', last_name: '', gender: '', date_of_birth: '', blood_group: '', email: '', phone: '', whatsapp: '', profession: '', organization: '', education: '', location: '', profile_image: '', visibility: 'community_only', is_deceased: false, facebook: '', instagram: '', linkedin: '', twitter: '' });
  const [fatherId, setFatherId] = useState('');
  const [motherId, setMotherId] = useState('');
  const [spouseId, setSpouseId] = useState('');
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddType, setQuickAddType] = useState('');

  useEffect(() => { supabase.from('communities').select('id,name').then(({ data }) => setCommunities((data as any) ?? [])); supabase.from('families').select('id,name,community_id').then(({ data }) => setFamilies((data as any) ?? [])); supabase.from('members').select('id,first_name,last_name,gender,family_id').neq('status', 'deleted').then(({ data }) => setExistingMembers((data as any) ?? [])); }, []);

  if (!user) return <div className="card text-center"><p style={{color:'var(--color-text-muted)'}}>Please <a href="/login">login</a>.</p></div>;

  const familyMembers = existingMembers.filter(m => m.family_id === f.family_id && m.id !== '');
  const s = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => { e.preventDefault(); setError(''); setLoading(true);
    try { const body: any = { ...f }; Object.keys(body).forEach(k => { if (body[k] === '' && k !== 'is_deceased' && k !== 'visibility') delete body[k]; });
      const { data: newMember, error: err } = await supabase.from('members').insert(body).select().single(); if (err) throw new Error(err.message); if (!newMember) throw new Error('Creation failed');
      const relationships: any[] = [];
      if (fatherId) { relationships.push({ member_id: newMember.id, related_member_id: fatherId, relationship_type: 'father' }); relationships.push({ member_id: fatherId, related_member_id: newMember.id, relationship_type: 'child' }); }
      if (motherId) { relationships.push({ member_id: newMember.id, related_member_id: motherId, relationship_type: 'mother' }); relationships.push({ member_id: motherId, related_member_id: newMember.id, relationship_type: 'child' }); }
      if (spouseId) { relationships.push({ member_id: newMember.id, related_member_id: spouseId, relationship_type: 'spouse' }); relationships.push({ member_id: spouseId, related_member_id: newMember.id, relationship_type: 'spouse' }); }
      if (relationships.length > 0) await supabase.from('member_relationships').insert(relationships);
      router.push('/members');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleQuickCreated = (newMember: any) => { setShowQuickAdd(false);
    if (quickAddType === 'father') setFatherId(newMember.id);
    else if (quickAddType === 'mother') setMotherId(newMember.id);
    else if (quickAddType === 'spouse') setSpouseId(newMember.id);
    supabase.from('members').select('id,first_name,last_name,gender,family_id').neq('status', 'deleted').then(({ data }) => setExistingMembers((data as any) ?? []));
  };

  return (
    <div style={{maxWidth:700,margin:'0 auto'}}>
      <h1 style={{fontSize:'var(--font-size-2xl)',fontWeight:700,marginBottom:'1.5rem'}}>Add Member</h1>
      <form onSubmit={submit}>
        <Section title="Basic Information">
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5 items-start">
            {/* Left: Profile Photo + Gender */}
            <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',alignItems:'center',minWidth:140}}>
              <ImageUpload currentUrl={f.profile_image || null} onUpload={(url) => s('profile_image', url)} />
              <div style={{width:'100%'}}>
                <Field label="Gender" required><select value={f.gender} onChange={e => s('gender', e.target.value)} className="input" required><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></Field>
              </div>
            </div>
            {/* Right: Name, DOB, Blood, Deceased */}
            <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',flex:1}}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Field label="First Name" required><input value={f.first_name} onChange={e => s('first_name', e.target.value)} className="input" required /></Field>
                <Field label="Last Name" required><input value={f.last_name} onChange={e => s('last_name', e.target.value)} className="input" required /></Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Field label="Date of Birth"><input type="date" value={f.date_of_birth} onChange={e => s('date_of_birth', e.target.value)} className="input" /></Field>
                <Field label="Blood Group"><select value={f.blood_group} onChange={e => s('blood_group', e.target.value)} className="input">{BLOOD.map(b => <option key={b} value={b}>{b || 'None'}</option>)}</select></Field>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', paddingTop:'0.25rem' }}>
                <input type="checkbox" checked={f.is_deceased} onChange={e => s('is_deceased', e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--color-danger)' }} />
                <span style={{ color: f.is_deceased ? 'var(--color-danger)' : 'var(--color-text-muted)', fontWeight: f.is_deceased ? 600 : 400 }}>Mark as deceased</span>
              </label>
            </div>
          </div>
        </Section>

        <Section title="Contact">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Email"><input type="email" value={f.email ?? ''} onChange={e => s('email', e.target.value)} className="input" /></Field>
            <Field label="Phone"><input value={f.phone ?? ''} onChange={e => s('phone', e.target.value)} className="input" /></Field>
            <Field label="WhatsApp"><input value={f.whatsapp ?? ''} onChange={e => s('whatsapp', e.target.value)} className="input" placeholder="+91xxxxxxxxxx" /></Field>
          </div>
        </Section>

        <Section title="Work & Education">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Profession"><input value={f.profession ?? ''} onChange={e => s('profession', e.target.value)} className="input" /></Field>
            <Field label="Organization"><input value={f.organization ?? ''} onChange={e => s('organization', e.target.value)} className="input" /></Field>
            <Field label="Education"><input value={f.education ?? ''} onChange={e => s('education', e.target.value)} className="input" /></Field>
            <Field label="Location"><input value={f.location ?? ''} onChange={e => s('location', e.target.value)} className="input" /></Field>
          </div>
        </Section>

        <Section title="Community & Family">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Community" required><select value={f.community_id} onChange={e => { s('community_id', e.target.value); s('family_id', ''); setFatherId(''); setMotherId(''); setSpouseId(''); }} className="input" required><option value="">Select</option>{communities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
            <Field label="Family" required><select value={f.family_id} onChange={e => s('family_id', e.target.value)} className="input" required><option value="">Select</option>{families.filter(ff => !f.community_id || ff.community_id === f.community_id).map(ff => <option key={ff.id} value={ff.id}>{ff.name}</option>)}</select></Field>
          </div>
        </Section>

        {f.family_id && (
          <Section title="Family Connections">
            <p style={{fontSize:'var(--font-size-xs)',color:'var(--color-text-muted)',marginTop:0,marginBottom:'0.75rem'}}>Link this member to existing family members. If the person is not added yet, click '+ New' to quickly create them.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Father">
                <div style={{display:'flex',gap:'0.25rem'}}>
                  <select value={fatherId} onChange={e => setFatherId(e.target.value)} className="input"><option value="">None</option>{familyMembers.filter(m => m.gender === 'male').map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}</select>
                  <button type="button" onClick={() => { setQuickAddType('father'); setShowQuickAdd(true); }} className="btn btn-outline btn-sm" title="Quick add father" style={{flexShrink:0,fontSize:'0.7rem'}}>+ New</button>
                </div>
              </Field>
              <Field label="Mother">
                <div style={{display:'flex',gap:'0.25rem'}}>
                  <select value={motherId} onChange={e => setMotherId(e.target.value)} className="input"><option value="">None</option>{familyMembers.filter(m => m.gender === 'female').map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}</select>
                  <button type="button" onClick={() => { setQuickAddType('mother'); setShowQuickAdd(true); }} className="btn btn-outline btn-sm" title="Quick add mother" style={{flexShrink:0,fontSize:'0.7rem'}}>+ New</button>
                </div>
              </Field>
              <Field label="Spouse">
                <div style={{display:'flex',gap:'0.25rem'}}>
                  <select value={spouseId} onChange={e => setSpouseId(e.target.value)} className="input"><option value="">None</option>{familyMembers.map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}</select>
                  <button type="button" onClick={() => { setQuickAddType('spouse'); setShowQuickAdd(true); }} className="btn btn-outline btn-sm" title="Quick add spouse" style={{flexShrink:0,fontSize:'0.7rem'}}>+ New</button>
                </div>
              </Field>
            </div>
          </Section>
        )}

        <Section title="Social Media">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Facebook"><input value={f.facebook ?? ''} onChange={e => s('facebook', e.target.value)} className="input" placeholder="https://fb.com/..." /></Field>
            <Field label="Instagram"><input value={f.instagram ?? ''} onChange={e => s('instagram', e.target.value)} className="input" placeholder="https://instagram.com/..." /></Field>
            <Field label="LinkedIn"><input value={f.linkedin ?? ''} onChange={e => s('linkedin', e.target.value)} className="input" placeholder="https://linkedin.com/in/..." /></Field>
            <Field label="Twitter/X"><input value={f.twitter ?? ''} onChange={e => s('twitter', e.target.value)} className="input" placeholder="https://x.com/..." /></Field>
          </div>
        </Section>

        {error && <p style={{color:'var(--color-danger)',marginBottom:'0.75rem',textAlign:'center'}}>{error}</p>}
        <div style={{display:'flex',gap:'0.75rem',justifyContent:'flex-end'}}>
          <button type="button" onClick={() => router.back()} className="btn btn-outline">Cancel</button>
          <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Creating...' : 'Create Member'}</button>
        </div>
      </form>
      {showQuickAdd && (
        <QuickAddMember
          communityId={f.community_id}
          familyId={f.family_id}
          onCreated={handleQuickCreated}
          onClose={() => setShowQuickAdd(false)}
        />
      )}
    </div>
  );
}
