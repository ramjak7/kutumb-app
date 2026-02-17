// src/app/api/export/expenses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { expensesToCSV, getExpenses } from '@/modules/ledgers/ledgerService';

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
    const expenses = await getExpenses();
    const csv = expensesToCSV(expenses);
    const date = new Date().toISOString().slice(0, 10);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type':        'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="expenses-${date}.csv"`,
        'Cache-Control':       'no-store',
      },
    });
  } catch (e) {
    console.error('Expense CSV export failed', e);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
