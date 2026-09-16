import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Order } from '@prisma/client';
import { GatewayType } from '@bldr/shared-types';
import { PaymentGateway } from './gateway.interface';
import { GeideaAdapter } from './geidea.adapter';
import { FawryAdapter } from './fawry.adapter';
import { MockGeideaAdapter } from './mock-geidea.adapter';
import { MockFawryAdapter } from './mock-fawry.adapter';

/**
 * GatewayFactory — selects the appropriate PaymentGateway adapter for an order.
 * Automatically delegates to Mock adapters when PAYMENT_SIMULATION_MODE=true.
 */
@Injectable()
export class GatewayFactory {
  constructor(
    private geideaAdapter: GeideaAdapter,
    private fawryAdapter: FawryAdapter,
    private mockGeideaAdapter: MockGeideaAdapter,
    private mockFawryAdapter: MockFawryAdapter,
    private config: ConfigService,
  ) {}

  isSimulationMode(): boolean {
    const isProd = this.config.get<string>('NODE_ENV') === 'production';
    if (isProd) return false;
    const mode = this.config.get<string>('PAYMENT_SIMULATION_MODE');
    // Default to true in dev if not explicitly disabled
    return mode === undefined || mode === '' || mode === 'true';
  }

  selectGateway(_order: Order): PaymentGateway {
    const isSim = this.isSimulationMode();
    const defaultGateway =
      (this.config.get<string>('DEFAULT_PAYMENT_GATEWAY') || 'geidea').toLowerCase();

    if (defaultGateway === 'fawry') {
      return isSim ? this.mockFawryAdapter : this.fawryAdapter;
    }

    // Default: Geidea (modal flow)
    return isSim ? this.mockGeideaAdapter : this.geideaAdapter;
  }

  getAdapter(type: GatewayType): PaymentGateway {
    const isSim = this.isSimulationMode();
    switch (type) {
      case GatewayType.FAWRY:
        return isSim ? this.mockFawryAdapter : this.fawryAdapter;
      case GatewayType.GEIDEA:
      default:
        return isSim ? this.mockGeideaAdapter : this.geideaAdapter;
    }
  }
}

