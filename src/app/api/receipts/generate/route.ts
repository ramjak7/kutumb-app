import { NextRequest, NextResponse } from 'next/server';
import { storeReceiptPDF } from '@/modules/receipts/receiptStorage';
import { ReceiptData } from '@/modules/receipts/pdfGenerator';
import { supabase } from '@/config/supabaseClient';

export async function POST(req: NextRequest) {
  const body = await req.json();
  // TODO: Validate input with Zod
  const receiptData: ReceiptData = body.receiptData;
  const fileName = `receipt-${receiptData.receiptNumber}.pdf`;
  try {
    const pdfPath = await storeReceiptPDF(receiptData, fileName);
    // Save receipt record in DB
    const { error } = await supabase.from('receipts').insert({
      donation_id: body.donationId,
      festival_id: body.festivalId,
      pdf_url: pdfPath,
      receipt_number: receiptData.receiptNumber,
      qr_code: receiptData.qrUrl,
      hash: '', // TODO: Compute hash
    });
    if (error) throw error;
    return NextResponse.json({ success: true, pdfPath });
  } catch (e) {
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 });
  }
}
