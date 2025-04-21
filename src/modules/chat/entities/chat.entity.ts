export class Chat {
  id: number;
  requestId: number;
  clientId: number;
  technicianId: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Chat>) {
    Object.assign(this, partial);
  }
}
