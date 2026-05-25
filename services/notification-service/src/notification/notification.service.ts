import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private prisma: PrismaService) {}

  async createOrderNotification(data: any) {
    const { orderId, userId, totalAmount } = data;

    // 1. Persist notification in DB
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        orderId,
        type: 'ORDER_CONFIRMED',
        title: 'Order Placed Successfully!',
        message: `Your order #${orderId} for $${totalAmount} has been placed.`,
      },
    });

    // 2. Simulate sending Email/SMS
    this.logger.log(`📧 Sending Email to User ${userId}: Your order ${orderId} is confirmed!`);
    this.logger.log(`📱 Sending SMS to User ${userId}: Order ${orderId} received.`);

    return notification;
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
