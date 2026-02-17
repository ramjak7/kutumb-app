export interface WhatsAppMessage {
  to: string;
  body: string;
  mediaUrl?: string;
}

export interface WhatsAppSender {
  sendMessage(message: WhatsAppMessage): Promise<{ success: boolean; error?: string }>;
}
