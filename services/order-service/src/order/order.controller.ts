import { Controller, Get, Post, Body, Headers, Param, NotFoundException } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Headers('x-user-id') userId: string, @Body() orderData: any) {
    const id = userId || 'test-user-id';
    return this.orderService.createOrder(id, orderData);
  }

  @Get()
  async getUserOrders(@Headers('x-user-id') userId: string) {
    const id = userId || 'test-user-id';
    return this.orderService.getUserOrders(id);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    const order = await this.orderService.getOrderById(id);
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }
}
