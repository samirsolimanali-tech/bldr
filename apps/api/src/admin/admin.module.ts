import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CommissionModule } from '../commission/commission.module';

@Module({
  imports: [CommissionModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
