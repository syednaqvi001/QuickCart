import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('order_placed')
  async handleOrderPlaced(@Payload() data: any) {
    return this.notificationService.createOrderNotification(data);
  }
}
