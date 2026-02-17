// src/app/api/export/donations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { donationsToCSV, getDonations } from '@/modules/ledgers/ledgerService';

export async function GET(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: () => {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const donations = await getDonations();
    const csv = donationsToCSV(donations);
    const date = new Date().toISOString().slice(0, 10);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type':        'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="donations-${date}.csv"`,
        'Cache-Control':       'no-store',
      },
    });
  } catch (e) {
    console.error('Donation CSV export failed', e);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
