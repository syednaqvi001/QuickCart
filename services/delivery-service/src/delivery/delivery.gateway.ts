import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DeliveryGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(DeliveryGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinOrder')
  handleJoinOrder(@MessageBody() orderId: string, @ConnectedSocket() client: Socket) {
    client.join(`order_${orderId}`);
    this.logger.log(`Client ${client.id} joined order room: ${orderId}`);
    return { event: 'joined', data: orderId };
  }

  sendLocationUpdate(orderId: string, location: any) {
    this.server.to(`order_${orderId}`).emit('locationUpdate', location);
  }

  sendStatusUpdate(orderId: string, status: string) {
    this.server.to(`order_${orderId}`).emit('statusUpdate', { orderId, status });
  }
}
