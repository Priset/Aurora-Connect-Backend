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

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
