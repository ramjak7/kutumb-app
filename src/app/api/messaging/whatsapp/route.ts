import { whatsappSender } from '@/lib/messaging';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { to, body, mediaUrl } = await req.json();
  const result = await whatsappSender.sendMessage({ to, body, mediaUrl });
  if (result.success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 });
  }
}
