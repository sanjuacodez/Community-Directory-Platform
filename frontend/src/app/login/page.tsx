'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/stores/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) { router.push('/'); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (mode === 'login') { await login(email, password); }
      else { await register(email, password); setError('Account created! Check your email to confirm.'); return; }
      router.push('/');
    } catch (err) { setError(err instanceof Error ? err.message : 'Auth failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto' }}>
      <div className="card" style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '2rem 1.5rem 0.5rem' }}>
        <img src="/logo.svg" alt="" width="48" height="48" style={{ margin: '0 auto 0.5rem' }} />
        <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, margin: 0 }}>CommunityHub</h1>
        <p style={{ color: 'var(--color-text-muted)', margin: '0.25rem 0 1.5rem' }}>
          {mode === 'login' ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label className="section-title" style={{ display: 'block', marginBottom: '0.25rem' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" required placeholder="you@example.com" />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="section-title" style={{ display: 'block', marginBottom: '0.25rem' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" required minLength={8} placeholder="Min 8 characters" />
          </div>
          {error && <p style={{ color: error.includes('created') ? 'var(--color-success)' : 'var(--color-danger)', fontSize: 'var(--font-size-xs)', marginBottom: '1rem' }}>{error}</p>}
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p style={{ margin: '1.25rem 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          {mode === 'login' ? (
            <>New here? <button onClick={() => { setMode('register'); setError(''); }} className="btn btn-ghost btn-sm" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Create account</button></>
          ) : (
            <>Already have an account? <button onClick={() => { setMode('login'); setError(''); }} className="btn btn-ghost btn-sm" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Sign in</button></>
          )}
        </p>
      </div>
    </div>
  );
}
