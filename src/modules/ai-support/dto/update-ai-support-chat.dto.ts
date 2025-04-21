import { PartialType } from '@nestjs/mapped-types';
import { CreateAiSupportChatDto } from './create-ai-support-chat.dto';

export class UpdateAiSupportChatDto extends PartialType(
  CreateAiSupportChatDto,
) {}
