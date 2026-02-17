// src/app/api/receipts/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────────
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

  // ── Parse & basic validate body ────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const {
    festivalId,
    donorName, amount, paymentMode,
    transactionNumber, donorPhone, donorEmail,
    donorAddress, donorPan,
  } = body as Record<string, string>;

  if (!donorName || !amount) {
    return NextResponse.json({ error: 'donorName and amount are required' }, { status: 400 });
  }
  if (isNaN(Number(amount)) || Number(amount) <= 0) {
    return NextResponse.json({ error: 'amount must be a positive number' }, { status: 400 });
  }

  // ── Generate receipt number: RCP-YYYYMMDD-XXXX ─────────────────────────────
  const today = new Date();
  const datePart = today.toISOString().slice(0, 10).replace(/-/g, '');
  const randPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  const receiptNumber = `RCP-${datePart}-${randPart}`;

  // ── QR URL: points to the download endpoint (populated after insert) ────────
  const qrBaseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://kutumb-app-ecru.vercel.app';

  // ── Compute hash for immutability ──────────────────────────────────────────
  const hashInput = JSON.stringify({ donorName, amount, receiptNumber, timestamp: today.toISOString() });
  const hash = crypto.createHash('sha256').update(hashInput).digest('hex');

  // ── Insert donation ────────────────────────────────────────────────────────
  const { data: donation, error: dErr } = await supabase
    .from('donations')
    .insert({
      festival_id:        festivalId ?? null,
      user_id:            user.id,
      amount:             Number(amount),
      donor_name:         donorName,
      payment_mode:       paymentMode ?? null,
      transaction_number: transactionNumber ?? null,
      donor_phone:        donorPhone ?? null,
      donor_email:        donorEmail ?? null,
      donor_address:      donorAddress ?? null,
      donor_pan:          donorPan ?? null,
      donor_details:      {}, // kept for backward compat
      verified:           false,
      hash,
    })
    .select()
    .single();

  if (dErr || !donation) {
    console.error('Donation insert failed', dErr);
    return NextResponse.json({ error: dErr?.message ?? 'Donation insert failed' }, { status: 500 });
  }

  // ── QR code points to receipt download URL ─────────────────────────────────
  // Will be updated after receipt row is inserted
  const qrPlaceholder = `${qrBaseUrl}/api/receipts/download/PENDING`;

  // ── Insert receipt metadata ────────────────────────────────────────────────
  const receiptHash = crypto.createHash('sha256')
    .update(JSON.stringify({ donorName, amount, receiptNumber, donationId: donation.id }))
    .digest('hex');

  const { data: receipt, error: rErr } = await supabase
    .from('receipts')
    .insert({
      donation_id:    donation.id,
      festival_id:    festivalId ?? null,
      pdf_url:        null,             // on-the-fly, no storage
      receipt_number: receiptNumber,
      qr_code:        qrPlaceholder,   // updated below
      issued_by:      user.id,
      hash:           receiptHash,
    })
    .select()
    .single();

  if (rErr || !receipt) {
    console.error('Receipt insert failed', rErr);
    return NextResponse.json({ error: rErr?.message ?? 'Receipt insert failed' }, { status: 500 });
  }

  // ── Update QR code with real receipt ID ───────────────────────────────────
  const realQrUrl = `${qrBaseUrl}/api/receipts/download/${receipt.id}`;
  await supabase
    .from('receipts')
    .update({ qr_code: realQrUrl })
    .eq('id', receipt.id);

  return NextResponse.json({
    success:       true,
    receiptId:     receipt.id,
    receiptNumber,
    donationId:    donation.id,
    downloadUrl:   `/api/receipts/download/${receipt.id}`,
  });
}
