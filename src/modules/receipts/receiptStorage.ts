import { generateReceiptPDF, ReceiptData } from './pdfGenerator';
import { supabase } from '@/config/supabaseClient';

export async function storeReceiptPDF(receiptData: ReceiptData, fileName: string): Promise<string> {
  const pdfBytes = await generateReceiptPDF(receiptData);
  const { data, error } = await supabase.storage.from('receipts').upload(fileName, pdfBytes, {
    contentType: 'application/pdf',
    upsert: false,
  });
  if (error) throw error;
  return data.path;
}
