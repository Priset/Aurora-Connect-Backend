import { Module } from '@nestjs/common';
import { ChatMessageController } from './chat-message.controller';
import { ChatMessageService } from './chat-message.service';
import { ChatGateway } from './chat-message.gateway';

@Module({
  controllers: [ChatMessageController],
  providers: [ChatMessageService, ChatGateway],
})
export class ChatMessageModule {}
