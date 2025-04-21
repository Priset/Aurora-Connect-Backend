export class AiSupportChat {
  id: number;
  userId: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<AiSupportChat>) {
    Object.assign(this, partial);
  }
}
