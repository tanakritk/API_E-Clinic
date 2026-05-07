import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from 'src/database/entities/trn-sale.entity';
import { SaleItem } from 'src/database/entities/trn-sale-item.entity';
import { SaleSchedule } from 'src/database/entities/trn-sale-schedule.entity';
import { SaleService } from '../services/trn-sale.service';
import { SaleRepo } from '../repositories/trn-sale.repo';
import { SaleItemRepo } from '../repositories/trn-sale-item.repo';
import { SaleScheduleRepo } from '../repositories/trn-sale-schedule.repo';
import { SaleController } from '../controllers/trn-sale.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleItem, SaleSchedule])],
  controllers: [SaleController],
  providers: [SaleService, SaleRepo, SaleItemRepo, SaleScheduleRepo],
  exports: [SaleService, SaleRepo, SaleItemRepo, SaleScheduleRepo],
})
export class SaleModule {}
