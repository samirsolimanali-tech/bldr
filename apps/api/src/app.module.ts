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
import { CheckoutModule } from './checkout/checkout.module';
import { ActivationCodesModule } from './activation-codes/activation-codes.module';
import { ProductsModule } from './products/products.module';

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
    CheckoutModule,   // Model B: external checkout-session API (POST /v1/checkout/sessions)
    ActivationCodesModule, // Single-use hashed activation code redemption & failure audit
    ProductsModule,   // PostgreSQL single source of truth product catalog & audit
  ],
})
export class AppModule {}

