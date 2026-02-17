import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

export interface ReceiptData {
  receiptNumber: string;
  festivalName: string;
  donorName: string;
  amount: number;
  date: string;
  qrUrl: string;
  branding?: {
    logoUrl?: string;
    footer?: string;
    themeColor?: string;
  };
  bilingual: {
    en: Record<string, string>;
    hi: Record<string, string>;
  };
}

export async function generateReceiptPDF(data: ReceiptData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([420, 595]); // A5 size
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Branding
  if (data.branding?.logoUrl) {
    // TODO: Fetch and embed logo image
  }

  // Title
  page.drawText(data.festivalName, {
    x: 40,
    y: height - 60,
    size: 20,
    font,
    color: rgb(0.95, 0.5, 0.15),
  });

  // Receipt Number
  page.drawText(`${data.bilingual.en['receipt.number']}: ${data.receiptNumber}`, {
    x: 40,
    y: height - 90,
    size: 12,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });
  page.drawText(`${data.bilingual.hi['receipt.number']}: ${data.receiptNumber}`, {
    x: 240,
    y: height - 90,
    size: 12,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Donor Details
  page.drawText(`${data.bilingual.en['donor.name']}: ${data.donorName}`, {
    x: 40,
    y: height - 120,
    size: 12,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });
  page.drawText(`${data.bilingual.hi['donor.name']}: ${data.donorName}`, {
    x: 240,
    y: height - 120,
    size: 12,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Amount
  page.drawText(`${data.bilingual.en['donation.amount']}: ₹${data.amount}`, {
    x: 40,
    y: height - 150,
    size: 12,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });
  page.drawText(`${data.bilingual.hi['donation.amount']}: ₹${data.amount}`, {
    x: 240,
    y: height - 150,
    size: 12,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Date
  page.drawText(`${data.bilingual.en['donation.date']}: ${data.date}`, {
    x: 40,
    y: height - 180,
    size: 12,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });
  page.drawText(`${data.bilingual.hi['donation.date']}: ${data.date}`, {
    x: 240,
    y: height - 180,
    size: 12,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  // QR Code
  const qrDataUrl = await QRCode.toDataURL(data.qrUrl, { width: 100 });
  const qrImageBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');
  const qrImage = await pdfDoc.embedPng(qrImageBytes);
  page.drawImage(qrImage, {
    x: width - 120,
    y: 40,
    width: 80,
    height: 80,
  });

  // Footer
  if (data.branding?.footer) {
    page.drawText(data.branding.footer, {
      x: 40,
      y: 30,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
  }

  return await pdfDoc.save();
}
