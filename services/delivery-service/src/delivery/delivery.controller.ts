import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DeliveryService } from './delivery.service';

@Controller()
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @EventPattern('order_placed')
  async handleOrderPlaced(@Payload() data: any) {
    return this.deliveryService.createDelivery(data);
  }
}
