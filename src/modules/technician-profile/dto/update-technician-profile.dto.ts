import { PartialType } from '@nestjs/mapped-types';
import { CreateTechnicianProfileDto } from './create-technician-profile.dto';

export class UpdateTechnicianProfileDto extends PartialType(
  CreateTechnicianProfileDto,
) {}
