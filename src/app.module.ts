import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ServiceRequestModule } from './modules/service-request/service-request.module';
import { ServiceOfferModule } from './modules/service-offer/service-offer.module';
import { ReviewModule } from './modules/review/review.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { ChatModule } from './modules/chat/chat.module';
import { AiSupportModule } from './modules/ai-support/ai-support.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PrismaModule } from './prisma/prisma.module';
import { TechnicianProfileModule } from './modules/technician-profile/technician-profile.module';
import { ConfigModule } from '@nestjs/config';
import { ChatMessageModule } from './modules/chat-message/chat-message.module';
import { AiSupportMessageModule } from './modules/ai-support-message/ai-support-message.module';
import { ServicePublicModule } from './modules/service-public/service-public.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ServiceRequestModule,
    ServiceOfferModule,
    ReviewModule,
    TicketModule,
    ChatModule,
    AiSupportModule,
    NotificationModule,
    TechnicianProfileModule,
    ChatMessageModule,
    AiSupportMessageModule,
    ServicePublicModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
