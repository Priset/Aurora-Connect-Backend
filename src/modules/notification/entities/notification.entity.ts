export class Notification {
  id: number;
  userId: number;
  content: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Notification>) {
    Object.assign(this, partial);
  }
}
