import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { OrdersModule } from '../orders/orders.module';
import { CommissionModule } from '../commission/commission.module';

@Module({
  imports: [OrdersModule, CommissionModule],
  providers: [TrackingService],
  controllers: [TrackingController],
})
export class TrackingModule {}
