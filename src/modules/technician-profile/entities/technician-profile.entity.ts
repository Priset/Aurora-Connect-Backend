export class TechnicianProfile {
  id: number;
  userId: number;
  experience?: string;
  yearsExperience?: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<TechnicianProfile>) {
    Object.assign(this, partial);
  }
}
