import { Module } from '@nestjs/common';
import { GeideaAdapter } from './geidea.adapter';
import { FawryAdapter } from './fawry.adapter';
import { PaymobAdapter } from './paymob.adapter';
import { MockGeideaAdapter } from './mock-geidea.adapter';
import { MockFawryAdapter } from './mock-fawry.adapter';
import { MockPaymobAdapter } from './mock-paymob.adapter';
import { GatewayFactory } from './gateway.factory';

@Module({
  providers: [
    GeideaAdapter,
    FawryAdapter,
    PaymobAdapter,
    MockGeideaAdapter,
    MockFawryAdapter,
    MockPaymobAdapter,
    GatewayFactory,
  ],
  exports: [GatewayFactory, MockGeideaAdapter, MockFawryAdapter, MockPaymobAdapter],
})
export class PaymentsModule {}
