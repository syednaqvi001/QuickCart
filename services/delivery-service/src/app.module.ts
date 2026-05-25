import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DeliveryModule } from './delivery/delivery.module';
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
        PORT: Joi.number().default(3006),
        DATABASE_URL: Joi.string().required(),
        RABBITMQ_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    DeliveryModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
  controllers: [HealthController],
})
export class AppModule {}
