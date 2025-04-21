import { Module } from '@nestjs/common';
import { AiSupportController } from './ai-support.controller';
import { AiSupportService } from './ai-support.service';

@Module({
  controllers: [AiSupportController],
  providers: [AiSupportService],
})
export class AiSupportModule {}
