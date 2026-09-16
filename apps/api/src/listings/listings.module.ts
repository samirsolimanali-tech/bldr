import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';

@Module({
  imports: [MulterModule.register({ dest: './uploads' })],
  providers: [ListingsService],
  controllers: [ListingsController],
  exports: [ListingsService],
})
export class ListingsModule {}
