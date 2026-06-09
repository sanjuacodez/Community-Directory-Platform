import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const projectRef = process.env['NEXT_PUBLIC_SUPABASE_URL']?.split('//')[1]?.split('.')[0] ?? '';

    const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];
    if (!serviceKey) {
      return NextResponse.json({ error: 'Service role key not configured. Set SUPABASE_SERVICE_ROLE_KEY in .env.local' }, { status: 500 });
    }

    const url = `https://${projectRef}.supabase.co/auth/v1/admin/users`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { created_by: 'admin_panel' },
      }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      return NextResponse.json({ error: data.msg || data.message || 'Failed to create user' }, { status: resp.status });
    }

    return NextResponse.json({ userId: data.id, email: data.email });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}
