// src/app/api/expenses/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import crypto from 'crypto';

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

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { festivalId, description, category, vendor, amount, paymentMode } = body as Record<string, string>;

  if (!description || !category || !amount) {
    return NextResponse.json({ error: 'description, category, and amount are required' }, { status: 400 });
  }
  if (isNaN(Number(amount)) || Number(amount) <= 0) {
    return NextResponse.json({ error: 'amount must be a positive number' }, { status: 400 });
  }

  const today = new Date();
  const hashInput = JSON.stringify({ description, amount, category, timestamp: today.toISOString() });
  const hash = crypto.createHash('sha256').update(hashInput).digest('hex');

  const { data: expense, error: eErr } = await supabase
    .from('expenses')
    .insert({
      festival_id:    festivalId ?? null,
      user_id:        user.id,
      amount:         Number(amount),
      description,
      category,
      vendor:         vendor ?? null,
      payment_mode:   paymentMode ?? null,
      expense_details: {}, // kept for backward compat
      verified:       false,
      hash,
    })
    .select()
    .single();

  if (eErr || !expense) {
    console.error('Expense insert failed', eErr);
    return NextResponse.json({ error: eErr?.message ?? 'Expense insert failed' }, { status: 500 });
  }

  return NextResponse.json({
    success:    true,
    expenseId:  expense.id,
  });
}
