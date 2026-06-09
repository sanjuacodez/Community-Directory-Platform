'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { QuickAddMember } from '@/components/quick-add-member';
import { ImageUpload } from '@/components/image-upload';

const BLOOD = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const TYPES = ['father', 'mother', 'spouse', 'child'];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-sm font-medium" style={{marginBottom:2}}>{label}</label>{children}</div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="card" style={{ padding: '1.25rem', marginBottom: '0.75rem' }}><h3 className="section-title" style={{ marginTop: 0, marginBottom: '0.75rem' }}>{title}</h3>{children}</div>;
}

export default function EditMemberPage() {
  const router = useRouter(); const p = useParams(); const { user } = useAuth();
  const [communities, setCommunities] = useState<any[]>([]); const [families, setFamilies] = useState<any[]>([]);
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [f, setF] = useState<any>({}); const [init, setInit] = useState(true);
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const [showRelForm, setShowRelForm] = useState(false); const [relType, setRelType] = useState('spouse');
  const [relMemberId, setRelMemberId] = useState(''); const [relError, setRelError] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false); const [quickAddType, setQuickAddType] = useState('');
  const [relationships, setRelationships] = useState<any[]>([]);
  const [createLoginPwd, setCreateLoginPwd] = useState('');
  const [creatingLogin, setCreatingLogin] = useState(false);
  const [loginMsg, setLoginMsg] = useState('');
  const [resetPwd, setResetPwd] = useState('');
  const [resettingPwd, setResettingPwd] = useState(false);
  const [resetMsg, setResetMsg] = useState('');

  useEffect(() => {
    supabase.from('communities').select('id,name').then(({ data }) => setCommunities((data as any) ?? []));
    supabase.from('families').select('id,name,community_id').then(({ data }) => setFamilies((data as any) ?? []));
    supabase.from('members').select('id,first_name,last_name,gender,family_id').neq('status', 'deleted').then(({ data }) => setAllMembers((data as any) ?? []));
    supabase.from('members').select('*').eq('id', p.id).single().then(({ data }) => { if (data) { setF(data); setInit(false); } });
  }, [p.id]);

  const loadRel = async () => { const { data: rels } = await supabase.from('member_relationships').select('id,relationship_type,related_member_id').eq('member_id', p.id);
    if (!rels?.length) { setRelationships([]); return; }
    const ids = rels.map((r: any) => r.related_member_id);
    const { data: related } = await supabase.from('members').select('id,first_name,last_name').in('id', ids);
    const map = new Map((related as any[] || []).map((m: any) => [m.id, m]));
    setRelationships(rels.map((r: any) => ({ ...r, member: map.get(r.related_member_id) })));
  };
  useEffect(() => { if (!init) loadRel(); }, [init]);

  const addRel = async (e: React.FormEvent) => { e.preventDefault(); setRelError('');
    try { const { error: err } = await supabase.from('member_relationships').insert({ member_id: p.id, related_member_id: relMemberId, relationship_type: relType });
      if (err) throw new Error(err.message); setShowRelForm(false); setRelMemberId(''); loadRel(); }
    catch (err: any) { setRelError(err.message); }
  };

  const delRel = async (id: string) => { await supabase.from('member_relationships').delete().eq('id', id); loadRel(); };

  const handleQuickCreated = async (newMember: any) => { setShowQuickAdd(false);
    await supabase.from('member_relationships').insert({ member_id: p.id, related_member_id: newMember.id, relationship_type: quickAddType });
    if (quickAddType === 'spouse') await supabase.from('member_relationships').insert({ member_id: newMember.id, related_member_id: p.id, relationship_type: 'spouse' });
    if (quickAddType === 'father' || quickAddType === 'mother') await supabase.from('member_relationships').insert({ member_id: newMember.id, related_member_id: p.id, relationship_type: 'child' });
    loadRel(); const { data: fresh } = await supabase.from('members').select('id,first_name,last_name,gender,family_id').neq('status', 'deleted'); setAllMembers((fresh as any) ?? []);
  };

  const handleCreateLogin = async () => { if (!f.email) { setLoginMsg('Email is required.'); return; } setCreatingLogin(true); setLoginMsg(''); const password = Math.random().toString(36).slice(-10) + 'A1!'; setCreateLoginPwd(password);
    try { const resp = await fetch('/api/create-auth-user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: f.email, password }) }); const result = await resp.json(); if (result.error) throw new Error(result.error); setLoginMsg(`Login created!`); if (result.userId) await supabase.from('members').update({ user_id: result.userId }).eq('id', p.id); }
    catch (err: any) { setLoginMsg(err.message || 'Failed'); } finally { setCreatingLogin(false); }
  };

  const handleResetPwd = async () => { if (!f.user_id) { setResetMsg('No login linked. Create login first.'); return; } const newPwd = Math.random().toString(36).slice(-10) + 'A1!'; setResettingPwd(true); setResetMsg('');
    try { const resp = await fetch('/api/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: f.user_id, password: newPwd }) }); const result = await resp.json(); if (result.error) throw new Error(result.error); setResetPwd(newPwd); setResetMsg(`Password reset!`); }
    catch (err: any) { setResetMsg(err.message || 'Failed'); } finally { setResettingPwd(false); }
  };

  const submit = async (e: React.FormEvent) => { e.preventDefault(); setError(''); setLoading(true);
    try { const { error: err } = await supabase.from('members').update({
        first_name: f.first_name, last_name: f.last_name, community_id: f.community_id, family_id: f.family_id,
        gender: f.gender, date_of_birth: f.date_of_birth || null, blood_group: f.blood_group || null,
        email: f.email || null, phone: f.phone || null, whatsapp: f.whatsapp || null,
        profession: f.profession || null, organization: f.organization || null, education: f.education || null,
        location: f.location || null, profile_image: f.profile_image || null, is_deceased: f.is_deceased ?? false,
        facebook: f.facebook || null, instagram: f.instagram || null, linkedin: f.linkedin || null, twitter: f.twitter || null,
      }).eq('id', p.id); if (err) throw new Error(err.message); router.push('/members'); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Update failed'); } finally { setLoading(false); }
  };

  if (!user) return <div className="card text-center"><p style={{color:'var(--color-text-muted)'}}>Please <a href="/login">login</a>.</p></div>;
  if (init) return <p style={{color:'var(--color-text-muted)'}}>Loading...</p>;

  const familyMembers = allMembers.filter(m => m.family_id === f.family_id);
  const s = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

  return (
    <div style={{maxWidth:700,margin:'0 auto'}}>
      <h1 style={{fontSize:'var(--font-size-2xl)',fontWeight:700,marginBottom:'1.5rem'}}>Edit Member</h1>
      <form onSubmit={submit}>
        <Section title="Basic Information">
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5 items-start">
            <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',alignItems:'center',minWidth:140}}>
              <ImageUpload currentUrl={f.profile_image || null} onUpload={(url) => s('profile_image', url)} />
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',flex:1}}>
              <Field label="Full Name"><input value={(f.first_name || '') + (f.last_name ? ' ' + f.last_name : '')} onChange={e => { const v = e.target.value; const sp = v.indexOf(' '); s('first_name', sp > 0 ? v.slice(0, sp) : v); s('last_name', sp > 0 ? v.slice(sp + 1) : ''); }} className="input" required placeholder="First Last" /></Field>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Field label="Gender"><select value={f.gender ?? ''} onChange={e => s('gender', e.target.value)} className="input"><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></Field>
                <Field label="DOB"><input type="date" value={f.date_of_birth?.split('T')[0] ?? ''} onChange={e => s('date_of_birth', e.target.value)} className="input" /></Field>
                <Field label="Blood Group"><select value={f.blood_group ?? ''} onChange={e => s('blood_group', e.target.value)} className="input">{BLOOD.map(b => <option key={b} value={b}>{b || 'None'}</option>)}</select></Field>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', paddingTop:'0.25rem' }}>
                <input type="checkbox" checked={f.is_deceased ?? false} onChange={e => s('is_deceased', e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--color-danger)' }} />
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
          {f.email && (
            <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
              <span className="section-title" style={{display:'block',marginBottom:'0.5rem'}}>Login Account</span>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={handleCreateLogin} disabled={creatingLogin} className="btn btn-accent btn-sm">{creatingLogin ? 'Creating...' : f.user_id ? 'Re-create Login' : 'Create Login Account'}</button>
                {f.user_id && <button type="button" onClick={handleResetPwd} disabled={resettingPwd} className="btn btn-outline btn-sm">{resettingPwd ? 'Resetting...' : 'Reset Password'}</button>}
              </div>
              {createLoginPwd && <p style={{fontSize:'var(--font-size-xs)',marginTop:'0.5rem',padding:'0.5rem',background:'white',borderRadius:'var(--radius-sm)'}}>Password: <code style={{fontWeight:700,fontSize:'0.9em'}}>{createLoginPwd}</code> — <span style={{color:'var(--color-danger)'}}>save this now, it won't be shown again</span></p>}
              {resetPwd && <p style={{fontSize:'var(--font-size-xs)',marginTop:'0.5rem',padding:'0.5rem',background:'white',borderRadius:'var(--radius-sm)'}}>New Password: <code style={{fontWeight:700,fontSize:'0.9em'}}>{resetPwd}</code> — <span style={{color:'var(--color-danger)'}}>save this now</span></p>}
              {loginMsg && <p style={{fontSize:'var(--font-size-xs)',marginTop:'0.5rem',color:loginMsg.includes('created')||loginMsg.includes('reset')?'var(--color-success)':loginMsg.includes('Failed')?'var(--color-danger)':'var(--color-text-muted)'}}>{loginMsg}</p>}
              {resetMsg && <p style={{fontSize:'var(--font-size-xs)',marginTop:'0.5rem',color:resetMsg.includes('reset')?'var(--color-success)':'var(--color-danger)'}}>{resetMsg}</p>}
            </div>
          )}
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
            <Field label="Community"><select value={f.community_id ?? ''} onChange={e => s('community_id', e.target.value)} className="input" required>{communities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
            <Field label="Family"><select value={f.family_id ?? ''} onChange={e => s('family_id', e.target.value)} className="input" required>{families.filter(ff => !f.community_id || ff.community_id === f.community_id).map(ff => <option key={ff.id} value={ff.id}>{ff.name}</option>)}</select></Field>
          </div>
        </Section>

        <Section title="Social Media">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Facebook"><input value={f.facebook ?? ''} onChange={e => s('facebook', e.target.value)} className="input" placeholder="https://fb.com/..." /></Field>
            <Field label="Instagram"><input value={f.instagram ?? ''} onChange={e => s('instagram', e.target.value)} className="input" placeholder="https://instagram.com/..." /></Field>
            <Field label="LinkedIn"><input value={f.linkedin ?? ''} onChange={e => s('linkedin', e.target.value)} className="input" placeholder="https://linkedin.com/in/..." /></Field>
            <Field label="Twitter/X"><input value={f.twitter ?? ''} onChange={e => s('twitter', e.target.value)} className="input" placeholder="https://x.com/..." /></Field>
          </div>
        </Section>

        {familyMembers.length > 0 && (
          <Section title="Family Connections">
            <div className="flex items-center justify-between mb-3">
              <span style={{fontSize:'var(--font-size-xs)',color:'var(--color-text-muted)'}}>{relationships.length} connection{relationships.length !== 1 ? 's' : ''}</span>
              <button type="button" onClick={() => setShowRelForm(true)} className="btn btn-accent btn-sm">+ Connect</button>
            </div>

            {showRelForm && (
              <div style={{ padding: '0.75rem', marginBottom: '0.75rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                <div className="flex flex-wrap gap-2 items-end">
                  <div style={{ minWidth: 100 }}><label className="text-xs font-medium block mb-1">Relation</label><select value={relType} onChange={e => setRelType(e.target.value)} className="input" style={{padding:'0.4rem 0.5rem',fontSize:'var(--font-size-xs)'}}>{TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                  <div style={{ flex: 1, minWidth: 150 }}><label className="text-xs font-medium block mb-1">Member</label><select value={relMemberId} onChange={e => setRelMemberId(e.target.value)} className="input" style={{padding:'0.4rem 0.5rem',fontSize:'var(--font-size-xs)'}} required><option value="">Select existing</option>{familyMembers.map(mm => <option key={mm.id} value={mm.id}>{mm.first_name} {mm.last_name}</option>)}</select></div>
                  <button type="button" onClick={addRel} className="btn btn-primary btn-sm">Link</button>
                  <button type="button" onClick={() => { setQuickAddType(relType); setShowQuickAdd(true); }} className="btn btn-outline btn-sm">+ New</button>
                  <button type="button" onClick={() => setShowRelForm(false)} className="btn btn-ghost btn-sm">Cancel</button>
                </div>
                {relError && <p style={{color:'var(--color-danger)',marginTop:'0.5rem',fontSize:'var(--font-size-xs)'}}>{relError}</p>}
              </div>
            )}

            <div className="space-y-1">
              {relationships.map((r: any) => (
                <div key={r.id} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="flex items-center gap-2">
                    <span className="badge capitalize" style={{fontSize:'0.65rem'}}>{r.relationship_type}</span>
                    <Link href={`/members/${r.related_member_id}`} style={{ fontWeight: 500, color: 'var(--color-primary)' }}>{r.member?.first_name} {r.member?.last_name}</Link>
                  </div>
                  <button type="button" onClick={() => delRel(r.id)} className="btn btn-danger btn-sm">Remove</button>
                </div>
              ))}
              {relationships.length === 0 && <p style={{color:'var(--color-text-muted)',fontSize:'var(--font-size-xs)'}}>No relationships yet.</p>}
            </div>
          </Section>
        )}

        {error && <p style={{color:'var(--color-danger)',marginBottom:'0.75rem',textAlign:'center'}}>{error}</p>}
        <div style={{display:'flex',gap:'0.75rem',justifyContent:'flex-end'}}>
          <button type="button" onClick={() => router.back()} className="btn btn-outline">Cancel</button>
          <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
      {showQuickAdd && <QuickAddMember communityId={f.community_id} familyId={f.family_id} onCreated={handleQuickCreated} onClose={() => setShowQuickAdd(false)} />}
    </div>
  );
}
