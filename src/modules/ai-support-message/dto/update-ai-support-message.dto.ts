import { PartialType } from '@nestjs/mapped-types';
import { CreateAiSupportMessageDto } from './create-ai-support-message.dto';

export class UpdateAiSupportMessageDto extends PartialType(
  CreateAiSupportMessageDto,
) {}
