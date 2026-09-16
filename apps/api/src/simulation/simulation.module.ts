import { Module } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { SimulationController } from './simulation.controller';
import { PaymentsModule } from '../payments/payments.module';
import { WebhooksModule } from '../webhooks/webhooks.module';

@Module({
  imports: [PaymentsModule, WebhooksModule],
  controllers: [SimulationController],
  providers: [SimulationService],
  exports: [SimulationService],
})
export class SimulationModule {}
