// src/app/api/expenses/reverse/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(req: NextRequest) {
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

  const body = await req.json();
  const { expenseId, reason, newAmount, newDescription } = body;

  if (!expenseId || !reason) {
    return NextResponse.json({ error: 'expenseId and reason are required' }, { status: 400 });
  }

  const { data, error } = await supabase.rpc('reverse_expense', {
    original_id: expenseId,
    reversal_reason: reason,
    new_amount: newAmount || null,
    new_description: newDescription || null,
  });

  if (error) {
    console.error('Reversal failed', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, reversalId: data });
}
