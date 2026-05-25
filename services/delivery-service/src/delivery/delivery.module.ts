import { Module } from '@nestjs/common';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { DeliveryGateway } from './delivery.gateway';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [DeliveryController],
  providers: [DeliveryService, DeliveryGateway, PrismaService],
})
export class DeliveryModule {}
