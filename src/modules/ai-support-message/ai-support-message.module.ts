import { Module } from '@nestjs/common';
import { AiSupportMessageController } from './ai-support-message.controller';
import { AiSupportMessageService } from './ai-support-message.service';

@Module({
  controllers: [AiSupportMessageController],
  providers: [AiSupportMessageService],
})
export class AiSupportMessageModule {}
