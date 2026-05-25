import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { DeliveryGateway } from './delivery.gateway';

@Injectable()
export class DeliveryService {
  private readonly logger = new Logger(DeliveryService.name);

  constructor(
    private prisma: PrismaService,
    private deliveryGateway: DeliveryGateway,
  ) {}

  async createDelivery(data: any) {
    const { orderId } = data;

    // 1. Create delivery record
    const delivery = await this.prisma.delivery.create({
      data: {
        orderId,
        deliveryAgentId: 'system-assigned-agent',
        status: 'ASSIGNED',
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60000), // 30 mins from now
      },
    });

    this.logger.log(`🚚 Delivery assigned for order: ${orderId}`);
    
    // 2. Notify clients via Socket.io
    this.deliveryGateway.sendStatusUpdate(orderId, 'ASSIGNED');

    return delivery;
  }

  async updateLocation(orderId: string, latitude: number, longitude: number) {
    const delivery = await this.prisma.delivery.update({
      where: { orderId },
      data: {
        currentLatitude: latitude,
        currentLongitude: longitude,
        status: 'EN_ROUTE',
      },
    });

    this.deliveryGateway.sendLocationUpdate(orderId, { latitude, longitude });
    return delivery;
  }

  async updateStatus(orderId: string, status: any) {
    const delivery = await this.prisma.delivery.update({
      where: { orderId },
      data: { status },
    });

    this.deliveryGateway.sendStatusUpdate(orderId, status);
    return delivery;
  }
}
