import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderModule } from './order/order.module';
import { PrismaService } from './database/prisma.service';
import * as Joi from 'joi';

import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3004),
        DATABASE_URL: Joi.string().required(),
        RABBITMQ_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        CART_SERVICE_URL: Joi.string().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'NOTIFY_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: 'notification_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    OrderModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
  controllers: [HealthController],
})
export class AppModule {}
