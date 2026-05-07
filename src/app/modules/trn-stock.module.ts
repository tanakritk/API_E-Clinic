import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from 'src/database/entities/trn-stock.entity';
import { StockService } from '../services/trn-stock.service';
import { StockRepo } from '../repositories/trn-stock.repo';
import { StockController } from '../controllers/trn-stock.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  controllers: [StockController],
  providers: [StockService, StockRepo],
  exports: [StockService, StockRepo],
})
export class StockModule {}
