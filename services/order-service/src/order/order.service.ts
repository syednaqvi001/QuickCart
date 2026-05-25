import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '../database/prisma.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private prisma: PrismaService,
    @Inject('NOTIFY_SERVICE') private readonly client: ClientProxy,
    private configService: ConfigService,
  ) {}

  async createOrder(userId: string, orderData: any) {
    const { deliveryAddress, deliveryNotes } = orderData;

    try {
      // 1. Get Cart from Cart Service
      const cartUrl = this.configService.get('CART_SERVICE_URL');
      const cartResponse = await axios.get(`${cartUrl}/api/cart`, {
        headers: { 'x-user-id': userId }
      });
      const cart = cartResponse.data;

      if (!cart || cart.items.length === 0) {
        throw new Error('Cart is empty');
      }

      // 2. Create Order in Database
      const order = await this.prisma.order.create({
        data: {
          userId,
          totalAmount: cart.totalPrice,
          deliveryAddress,
          deliveryNotes,
          status: 'PENDING',
          items: {
            create: cart.items.map((item: any) => ({
              productId: item.productId,
              productName: item.name,
              productImage: item.imageUrl,
              quantity: item.quantity,
              unitPrice: item.price,
              totalPrice: item.price * item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      // 3. Clear Cart (Fire and forget or wait)
      axios.delete(`${cartUrl}/api/cart`, {
        headers: { 'x-user-id': userId }
      }).catch(err => this.logger.error(`Failed to clear cart: ${err.message}`));

      // 4. Publish Event to RabbitMQ
      this.client.emit('order_placed', {
        orderId: order.id,
        userId: order.userId,
        totalAmount: order.totalAmount,
        items: order.items,
      });

      this.logger.log(`✅ Order created and event published: ${order.id}`);
      return order;
    } catch (error) {
      this.logger.error(`❌ Failed to create order: ${error.message}`);
      throw error;
    }
  }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
  }
}
