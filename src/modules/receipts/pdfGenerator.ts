import 'regenerator-runtime/runtime';
import { PDFDocument, rgb, StandardFonts, RGB } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import QRCode from 'qrcode';

export interface ReceiptData {
  receiptNumber: string;
  festivalName: string;
  donorName: string;
  amount: number;
  date: string;
  paymentMode?: string;
  transactionNumber?: string;
  donorPhone?: string;
  donorEmail?: string;
  donorAddress?: string;
  donorPan?: string;
  qrUrl: string;
  branding?: {
    logoUrl?: string;
    footer?: string;
    themeColor?: string;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '');
  return rgb(
    parseInt(clean.substring(0, 2), 16) / 255,
    parseInt(clean.substring(2, 4), 16) / 255,
    parseInt(clean.substring(4, 6), 16) / 255,
  );
}

const ORANGE = rgb(0.91, 0.42, 0.09);
const DARK   = rgb(0.15, 0.15, 0.15);
const MUTED  = rgb(0.45, 0.45, 0.45);
const LIGHT  = rgb(0.96, 0.96, 0.96);
const WHITE  = rgb(1, 1, 1);

// ─── Main Generator ───────────────────────────────────────────────────────────

export async function generateReceiptPDF(data: ReceiptData): Promise<Uint8Array> {
  const pdfDoc  = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const page    = pdfDoc.addPage([595, 420]); // A5 landscape
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold    = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // ── Load Devanagari font for Hindi text ───────────────────────────────────────
  const fontUrl = `${process.env.NEXT_PUBLIC_APP_URL}/fonts/aparajbi.ttf`;
  const fontResponse = await fetch(fontUrl);
  const fontBytes = await fontResponse.arrayBuffer();
  const hindiFont = await pdfDoc.embedFont(fontBytes);

  const accent = data.branding?.themeColor ? hexToRgb(data.branding.themeColor) : ORANGE;

  // ── Background header band ────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: accent });

  // ── Festival name ─────────────────────────────────────────────────────────
  page.drawText(data.festivalName.toUpperCase(), {
    x: 30, y: height - 48,
    size: 18, font: fontBold, color: WHITE,
  });

  // ── RECEIPT label (top right) - bilingual ─────────────────────────────────
  page.drawText('RECEIPT', {
    x: width - 180, y: height - 32,
    size: 11, font: fontBold, color: WHITE,
  });
  page.drawText('रसीद', {
    x: width - 180, y: height - 48,
    size: 10, font: hindiFont, color: WHITE,
  });
  page.drawText(`No. ${data.receiptNumber}`, {
    x: width - 180, y: height - 64,
    size: 9, font: fontRegular, color: WHITE,
  });

  // ── Left column: donor details ────────────────────────────────────────────
  let y = height - 105;
  const col1En = 30;
  const col1Hi = 160;
  const col2 = 290;
  const lineH = 20;

  function bilingualRow(labelEn: string, labelHi: string, value: string, bold = false) {
    if (!value) return;
    // English label
    page.drawText(labelEn, { 
      x: col1En, y, size: 9, font: fontRegular, color: MUTED 
    });
    // Hindi label
    page.drawText(labelHi, { 
      x: col1Hi, y, size: 9, font: hindiFont, color: MUTED 
    });
    // Value - use Hindi font if contains Unicode (₹, Devanagari, etc.)
    const hasUnicode = /[^\x00-\x7F]/.test(value);
    const valueFont = hasUnicode ? hindiFont : (bold ? fontBold : fontRegular);

    page.drawText(value, { 
      x: col2, y, size: 10,
      font: valueFont,
      color: DARK 
    });
    y -= lineH;
  }

  bilingualRow('Donor Name', 'दाता का नाम', data.donorName, true);
  bilingualRow('Amount', 'राशि', `₹${Number(data.amount).toLocaleString('en-IN')}`, true);
  bilingualRow('Date', 'तारीख', data.date);
  bilingualRow('Payment Mode', 'भुगतान विधि', data.paymentMode ?? '');
  bilingualRow('Transaction #', 'लेनदेन #', data.transactionNumber ?? '');
  bilingualRow('Phone', 'फ़ोन', data.donorPhone ?? '');
  bilingualRow('Email', 'ईमेल', data.donorEmail ?? '');
  bilingualRow('PAN', 'पैन', data.donorPan ?? '');
  bilingualRow('Address', 'पता', data.donorAddress ?? '');

  // ── Divider ───────────────────────────────────────────────────────────────
  page.drawLine({
    start: { x: 30, y: y + 8 },
    end:   { x: width - 30, y: y + 8 },
    thickness: 0.5,
    color: LIGHT,
  });

  // ── QR Code (right column) ────────────────────────────────────────────────
  const qrDataUrl   = await QRCode.toDataURL(data.qrUrl, { width: 120, margin: 1 });
  const qrBytes     = Buffer.from(qrDataUrl.split(',')[1], 'base64');
  const qrImage     = await pdfDoc.embedPng(qrBytes);
  const qrSize      = 110;
  const qrX         = width - qrSize - 30;
  const qrY         = 60;

  // QR background card
  page.drawRectangle({
    x: qrX - 8, y: qrY - 8,
    width: qrSize + 16, height: qrSize + 30,
    color: LIGHT,
  });
  page.drawImage(qrImage, { x: qrX, y: qrY, width: qrSize, height: qrSize });
  page.drawText('Scan to verify', {
    x: qrX + 10, y: qrY - 4,
    size: 7, font: fontRegular, color: MUTED,
  });

  // ── Footer ────────────────────────────────────────────────────────────────
  const footerText = data.branding?.footer ?? 'This is a computer-generated receipt.';
  page.drawText(footerText, {
    x: 30, y: 18,
    size: 8, font: fontRegular, color: MUTED,
  });

  // ── Accent bottom strip ───────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: 0, width, height: 6, color: accent });

  return pdfDoc.save();
}
