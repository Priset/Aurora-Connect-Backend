export class Review {
  id: number;
  requestId: number;
  reviewerId: number;
  technicianId: number;
  comment?: string;
  rating: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Review>) {
    Object.assign(this, partial);
  }
}
