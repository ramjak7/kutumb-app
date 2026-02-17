// src/modules/receipts/pdfGenerator.ts
import { PDFDocument, rgb, StandardFonts, RGB } from 'pdf-lib';
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
  const page    = pdfDoc.addPage([595, 420]); // A5 landscape
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold    = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const accent = data.branding?.themeColor ? hexToRgb(data.branding.themeColor) : ORANGE;

  // ── Background header band ────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: accent });

  // ── Festival name ─────────────────────────────────────────────────────────
  page.drawText(data.festivalName.toUpperCase(), {
    x: 30, y: height - 48,
    size: 18, font: fontBold, color: WHITE,
  });

  // ── RECEIPT label (top right) ─────────────────────────────────────────────
  page.drawText('RECEIPT / रसीद', {
    x: width - 180, y: height - 38,
    size: 11, font: fontBold, color: WHITE,
  });
  page.drawText(`No. ${data.receiptNumber}`, {
    x: width - 180, y: height - 56,
    size: 10, font: fontRegular, color: WHITE,
  });

  // ── Left column: donor details ────────────────────────────────────────────
  let y = height - 105;
  const col1 = 30;
  const col2 = 180;
  const lineH = 22;

  function row(label: string, value: string, bold = false) {
    if (!value) return;
    page.drawText(label, { x: col1, y, size: 9, font: fontRegular, color: MUTED });
    page.drawText(value, { x: col2, y, size: 10,
      font: bold ? fontBold : fontRegular, color: DARK });
    y -= lineH;
  }

  row('Donor Name / दाता का नाम',  data.donorName, true);
  row('Amount / राशि',             `₹${Number(data.amount).toLocaleString('en-IN')}`, true);
  row('Date / तारीख',              data.date);
  row('Payment Mode / भुगतान विधि', data.paymentMode ?? '');
  row('Transaction # / लेनदेन #',  data.transactionNumber ?? '');
  row('Phone / फ़ोन',              data.donorPhone ?? '');
  row('Email / ईमेल',             data.donorEmail ?? '');
  row('PAN',                       data.donorPan ?? '');
  row('Address / पता',            data.donorAddress ?? '');

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
    //borderRadius: 4,
  });
  page.drawImage(qrImage, { x: qrX, y: qrY, width: qrSize, height: qrSize });
  page.drawText('Scan to verify', {
    x: qrX - 2, y: qrY - 4,
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
