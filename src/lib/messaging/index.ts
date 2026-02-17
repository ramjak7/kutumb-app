import { WhatsAppSenderProd, WhatsAppSenderMock } from './WhatsAppProvider';
import { WhatsAppSender } from './WhatsAppSender';

const isDev = process.env.NODE_ENV !== 'production';

export const whatsappSender: WhatsAppSender = isDev
  ? new WhatsAppSenderMock()
  : new WhatsAppSenderProd();
