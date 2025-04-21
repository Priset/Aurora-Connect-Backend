export class ServiceOffer {
  id: number;
  requestId: number;
  technicianId: number;
  message?: string;
  proposedPrice?: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ServiceOffer>) {
    Object.assign(this, partial);
  }
}
