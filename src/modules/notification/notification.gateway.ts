import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { notifications } from '@prisma/client';

@WebSocketGateway({ cors: true })
export class NotificationGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('✅ Notification WebSocket Gateway initialized');
  }

  emitNewNotification(notification: notifications) {
    this.server.emit(`notification:${notification.user_id}`, notification);
  }
}
