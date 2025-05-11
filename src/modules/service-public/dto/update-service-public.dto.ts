import { PartialType } from '@nestjs/mapped-types';
import { CreateServicePublicDto } from './create-service-public.dto';

export class UpdateServicePublicDto extends PartialType(
  CreateServicePublicDto,
) {}
