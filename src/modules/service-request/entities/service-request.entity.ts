export class ServiceRequest {
  id: number;
  clientId: number;
  description: string;
  offeredPrice: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ServiceRequest>) {
    Object.assign(this, partial);
  }
}
