import { Module } from '@nestjs/common';
import { CheckoutSessionsController } from './checkout-sessions.controller';
import { CheckoutSessionsService } from './checkout-sessions.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CheckoutSessionsController],
  providers: [CheckoutSessionsService],
  exports: [CheckoutSessionsService], // exported so settlement module can reuse calculator
})
export class CheckoutModule {}
