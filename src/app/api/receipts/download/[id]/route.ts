// src/app/api/receipts/download/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { generateReceiptPDF, ReceiptData } from '@/modules/receipts/pdfGenerator';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ── Auth: verify admin session via cookies ─────────────────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: () => {},           // read-only route, no cookie writes needed
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // ── Fetch receipt + joined donation ───────────────────────────────────────
  const { data: receipt, error: rErr } = await supabase
    .from('receipts')
    .select('*, donations(*)')
    .eq('id', id)
    .single();

  if (rErr || !receipt) {
    return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
  }

  if (receipt.voided) {
    return NextResponse.json({ error: 'Receipt has been voided' }, { status: 410 });
  }

  const donation = receipt.donations as Record<string, unknown> | null;

  // ── Fetch festival branding ────────────────────────────────────────────────
  let festivalName = 'Kutumb Festival';
  let footer: string | undefined;
  let themeColor: string | undefined;

  if (receipt.festival_id) {
    const { data: festival } = await supabase
      .from('festivals')
      .select('name, receipt_footer, theme_colors')
      .eq('id', receipt.festival_id)
      .single();
    if (festival) {
      festivalName = festival.name ?? festivalName;
      footer       = festival.receipt_footer ?? undefined;
      themeColor   = (festival.theme_colors as Record<string,string>)?.primary ?? undefined;
    }
  }

  // ── Build ReceiptData ──────────────────────────────────────────────────────
  const receiptData: ReceiptData = {
    receiptNumber:     receipt.receipt_number,
    festivalName,
    donorName:         String(donation?.donor_name ?? (donation?.donor_details as Record<string,unknown>)?.donorName ?? 'Donor'),
    amount:            Number(donation?.amount ?? 0),
    date:              new Date(receipt.created_at).toLocaleDateString('en-IN'),
    paymentMode:       donation?.payment_mode as string | undefined,
    transactionNumber: donation?.transaction_number as string | undefined,
    donorPhone:        donation?.donor_phone as string | undefined,
    donorEmail:        donation?.donor_email as string | undefined,
    donorAddress:      donation?.donor_address as string | undefined,
    donorPan:          donation?.donor_pan as string | undefined,
    qrUrl:             receipt.qr_code,
    branding:          { footer, themeColor },
  };

  // ── Generate PDF ───────────────────────────────────────────────────────────
  let pdfBytes: Uint8Array;
  try {
    pdfBytes = await generateReceiptPDF(receiptData);
  } catch (e) {
    console.error('PDF generation failed', e);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  }

  // ── Stream response ────────────────────────────────────────────────────────
  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      'Content-Type':        'application/pdf',
      'Content-Disposition': `attachment; filename="receipt-${receipt.receipt_number}.pdf"`,
      'Cache-Control':       'no-store',
    },
  });
}
