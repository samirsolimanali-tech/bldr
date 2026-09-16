import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { WebhooksService } from '../webhooks/webhooks.service';
import { MockGeideaAdapter } from '../payments/mock-geidea.adapter';
import { MockFawryAdapter } from '../payments/mock-fawry.adapter';
import { GatewayFactory } from '../payments/gateway.factory';

@Injectable()
export class SimulationService {
  private readonly logger = new Logger(SimulationService.name);

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private webhooksService: WebhooksService,
    private gatewayFactory: GatewayFactory,
  ) {}

  getConfig() {
    const isSim = this.gatewayFactory.isSimulationMode();
    const defaultGateway = this.config.get<string>('DEFAULT_PAYMENT_GATEWAY') || 'geidea';
    return {
      paymentSimulationMode: isSim,
      defaultGateway,
    };
  }

  async triggerGeideaWebhook(dto: {
    orderId: string;
    status?: 'paid' | 'failed';
    tamper?: boolean;
    delayMs?: number;
  }) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });
    if (!order) throw new NotFoundException(`Order ${dto.orderId} not found`);

    if (dto.delayMs && dto.delayMs > 0) {
      await new Promise(r => setTimeout(r, dto.delayMs));
    }

    const { payload, signature } = MockGeideaAdapter.buildSignedWebhook({
      orderId: order.id,
      amount: order.amount.toString(),
      currency: order.currency,
      status: dto.status || 'paid',
      tamper: dto.tamper,
    });

    try {
      await this.webhooksService.handleGeidea(
        payload,
        Buffer.from(JSON.stringify(payload)),
        { signature },
      );
      this.logger.log(`[Simulation] Geidea webhook executed successfully for order ${order.id} (status: ${dto.status || 'paid'})`);
      return {
        success: true,
        orderId: order.id,
        simulatedStatus: dto.status || 'paid',
        signatureValid: !dto.tamper,
        message: 'Simulated Geidea webhook executed and verified successfully',
      };
    } catch (err: any) {
      this.logger.warn(`[Simulation] Geidea webhook rejected as expected: ${err.message}`);
      return {
        success: false,
        orderId: order.id,
        simulatedStatus: dto.status || 'paid',
        signatureValid: false,
        error: err.message,
        message: 'Simulated Geidea webhook was rejected by verification logic',
      };
    }
  }

  async triggerFawryWebhook(dto: {
    orderId: string;
    status?: 'PAID' | 'FAILED';
    tamper?: boolean;
    delayMs?: number;
  }) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });
    if (!order) throw new NotFoundException(`Order ${dto.orderId} not found`);

    if (dto.delayMs && dto.delayMs > 0) {
      await new Promise(r => setTimeout(r, dto.delayMs));
    }

    const { payload, signature } = MockFawryAdapter.buildSignedWebhook({
      orderId: order.id,
      amount: order.amount.toString(),
      status: dto.status || 'PAID',
      tamper: dto.tamper,
    });

    try {
      await this.webhooksService.handleFawry(
        payload,
        Buffer.from(JSON.stringify(payload)),
        { signature },
      );
      this.logger.log(`[Simulation] Fawry webhook executed successfully for order ${order.id} (status: ${dto.status || 'PAID'})`);
      return {
        success: true,
        orderId: order.id,
        simulatedStatus: dto.status || 'PAID',
        signatureValid: !dto.tamper,
        message: 'Simulated Fawry webhook executed and verified successfully',
      };
    } catch (err: any) {
      this.logger.warn(`[Simulation] Fawry webhook rejected as expected: ${err.message}`);
      return {
        success: false,
        orderId: order.id,
        simulatedStatus: dto.status || 'PAID',
        signatureValid: false,
        error: err.message,
        message: 'Simulated Fawry webhook was rejected by verification logic',
      };
    }
  }

  async getRecentOrders() {
    return this.prisma.order.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        listing: { select: { id: true, title: true } },
        provider: { select: { id: true, name: true, slug: true } },
        transactions: { select: { id: true, signatureValid: true, createdAt: true } },
      },
    });
  }
}
