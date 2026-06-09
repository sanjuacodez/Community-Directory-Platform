import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, password } = await request.json();
    const projectRef = process.env['NEXT_PUBLIC_SUPABASE_URL']?.split('//')[1]?.split('.')[0] ?? '';
    const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

    if (!serviceKey) return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 });

    const url = `https://${projectRef}.supabase.co/auth/v1/admin/users/${userId}`;
    const resp = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${serviceKey}`, 'apikey': serviceKey },
      body: JSON.stringify({ password }),
    });

    if (!resp.ok) {
      const data = await resp.json();
      return NextResponse.json({ error: data.msg || 'Failed' }, { status: resp.status });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown' }, { status: 500 });
  }
}
