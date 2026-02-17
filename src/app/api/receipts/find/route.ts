// src/app/api/receipts/find/route.ts
// Finds a receipt by donationId — used by the donations ledger download button
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

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

  const donationId = req.nextUrl.searchParams.get('donationId');
  if (!donationId) {
    return NextResponse.json({ error: 'donationId is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('receipts')
    .select('id, receipt_number')
    .eq('donation_id', donationId)
    .eq('voided', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'No receipt found' }, { status: 404 });
  }

  return NextResponse.json({ receiptId: data.id, receiptNumber: data.receipt_number });
}
