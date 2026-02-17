import { WhatsAppSender, WhatsAppMessage } from './WhatsAppSender';

export class WhatsAppSenderProd implements WhatsAppSender {
  async sendMessage(message: WhatsAppMessage) {
    // Credentials and API URL must be set in environment variables
    const apiUrl = process.env.WHATSAPP_API_URL;
    const apiKey = process.env.WHATSAPP_API_KEY;
    if (!apiUrl || !apiKey) {
      return { success: false, error: 'WhatsApp API credentials not set' };
    }
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(message),
      });
      if (!res.ok) {
        return { success: false, error: `API error: ${res.status}` };
      }
      return { success: true };
    } catch (e) {
      return { success: false, error: (e as Error).message };
    }
  }
}

export class WhatsAppSenderMock implements WhatsAppSender {
  async sendMessage(message: WhatsAppMessage) {
    // Log to console for dev
    console.log('Mock WhatsApp send:', message);
    return { success: true };
  }
}
