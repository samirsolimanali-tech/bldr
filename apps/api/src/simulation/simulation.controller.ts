import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SimulationService } from './simulation.service';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class TriggerGeideaSimDto {
  @IsString() orderId: string;
  @IsOptional() @IsString() status?: 'paid' | 'failed';
  @IsOptional() @IsBoolean() tamper?: boolean;
  @IsOptional() @IsNumber() delayMs?: number;
}

export class TriggerFawrySimDto {
  @IsString() orderId: string;
  @IsOptional() @IsString() status?: 'PAID' | 'FAILED';
  @IsOptional() @IsBoolean() tamper?: boolean;
  @IsOptional() @IsNumber() delayMs?: number;
}

@ApiTags('simulation')
@Controller()
export class SimulationController {
  constructor(private svc: SimulationService) {}

  /**
   * GET /config
   * Public configuration endpoint exposing feature flags like paymentSimulationMode.
   */
  @Get('config')
  getConfig() {
    return this.svc.getConfig();
  }

  /**
   * POST /simulation/geidea/trigger
   * Triggers a signed Geidea webhook to settle or fail a simulated order.
   */
  @Post('simulation/geidea/trigger')
  triggerGeidea(@Body() dto: TriggerGeideaSimDto) {
    return this.svc.triggerGeideaWebhook(dto);
  }

  /**
   * POST /simulation/fawry/trigger
   * Triggers a signed Fawry webhook to settle or fail a simulated order.
   */
  @Post('simulation/fawry/trigger')
  triggerFawry(@Body() dto: TriggerFawrySimDto) {
    return this.svc.triggerFawryWebhook(dto);
  }

  /**
   * GET /simulation/orders
   * Returns recent orders for the admin simulation control panel.
   */
  @Get('simulation/orders')
  getRecentOrders() {
    return this.svc.getRecentOrders();
  }
}
