export class Ticket {
  id: number;
  requestId: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;

  constructor(partial: Partial<Ticket>) {
    Object.assign(this, partial);
  }
}
