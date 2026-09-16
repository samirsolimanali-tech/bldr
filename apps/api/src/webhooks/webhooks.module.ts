import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { PaymentsModule } from '../payments/payments.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [PaymentsModule, OrdersModule],
  providers: [WebhooksService],
  controllers: [WebhooksController],
  exports: [WebhooksService],
})
export class WebhooksModule {}
