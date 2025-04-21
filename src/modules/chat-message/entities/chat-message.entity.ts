export class ChatMessage {
  id: number;
  chatId: number;
  senderId: number;
  message: string;
  status: number;
  sentAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ChatMessage>) {
    Object.assign(this, partial);
  }
}
