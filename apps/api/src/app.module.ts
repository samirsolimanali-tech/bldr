import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProvidersModule } from './providers/providers.module';
import { ListingsModule } from './listings/listings.module';
import { LeadsModule } from './leads/leads.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { TrackingModule } from './tracking/tracking.module';
import { CommissionModule } from './commission/commission.module';
import { PayoutsModule } from './payouts/payouts.module';
import { AdminModule } from './admin/admin.module';
import { SimulationModule } from './simulation/simulation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Serve uploaded media files
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    ProvidersModule,
    ListingsModule,
    LeadsModule,
    OrdersModule,
    PaymentsModule,
    WebhooksModule,
    TrackingModule,
    CommissionModule,
    PayoutsModule,
    AdminModule,
    SimulationModule,
  ],
})
export class AppModule {}

