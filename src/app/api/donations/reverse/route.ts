// src/app/api/donations/reverse/route.ts
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
  const { donationId, reason, newAmount, newDonorName } = body;

  if (!donationId || !reason) {
    return NextResponse.json({ error: 'donationId and reason are required' }, { status: 400 });
  }

  // Call the reverse_donation stored procedure
  const { data, error } = await supabase.rpc('reverse_donation', {
    original_id: donationId,
    reversal_reason: reason,
    new_amount: newAmount || null,
    new_donor_name: newDonorName || null,
  });

  if (error) {
    console.error('Reversal failed', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, reversalId: data });
}
