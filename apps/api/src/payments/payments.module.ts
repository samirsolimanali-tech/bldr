import { Module } from '@nestjs/common';
import { GeideaAdapter } from './geidea.adapter';
import { FawryAdapter } from './fawry.adapter';
import { MockGeideaAdapter } from './mock-geidea.adapter';
import { MockFawryAdapter } from './mock-fawry.adapter';
import { GatewayFactory } from './gateway.factory';

@Module({
  providers: [
    GeideaAdapter,
    FawryAdapter,
    MockGeideaAdapter,
    MockFawryAdapter,
    GatewayFactory,
  ],
  exports: [GatewayFactory, MockGeideaAdapter, MockFawryAdapter],
})
export class PaymentsModule {}

