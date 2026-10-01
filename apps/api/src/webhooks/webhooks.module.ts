import { Module, forwardRef } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { PaymentsModule } from '../payments/payments.module';
import { OrdersModule } from '../orders/orders.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CheckoutModule } from '../checkout/checkout.module';

@Module({
  imports: [PrismaModule, PaymentsModule, OrdersModule, forwardRef(() => CheckoutModule)],
  providers: [WebhooksService],
  controllers: [WebhooksController],
  exports: [WebhooksService],
})
export class WebhooksModule {}
