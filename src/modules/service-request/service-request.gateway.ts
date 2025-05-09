import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { service_requests } from '@prisma/client';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ServiceRequestGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('✅ ServiceRequest WebSocket Gateway initialized');
  }

  emitNewServiceRequest(data: any) {
    this.server.emit('new-service-request', data);
  }

  emitRequestUpdated(request: service_requests) {
    this.server.emit('service-request-updated', request);
  }
}
