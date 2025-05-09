import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { service_offers } from '@prisma/client';

@WebSocketGateway({ cors: true })
@Injectable()
export class ServiceOfferGateway {
  @WebSocketServer()
  server: Server;

  emitOfferCreated(offer: service_offers) {
    this.server.emit('service-offer-created', offer);
  }

  emitOfferUpdated(offer: service_offers) {
    this.server.emit('service-offer-updated', offer);
  }
}
