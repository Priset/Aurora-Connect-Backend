import { Module } from '@nestjs/common';
import { AiSupportMessageController } from './ai-support-message.controller';
import { AiSupportMessageService } from './ai-support-message.service';
import { CohereModule } from '../../common/cohere/cohere.module';

@Module({
  imports: [CohereModule],
  controllers: [AiSupportMessageController],
  providers: [AiSupportMessageService],
})
export class AiSupportMessageModule {}
