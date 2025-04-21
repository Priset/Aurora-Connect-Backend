export class AiSupportMessage {
  id: number;
  chatId: number;
  role: string;
  content: string;
  status: number;
  sentAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<AiSupportMessage>) {
    Object.assign(this, partial);
  }
}
