import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleSchedule } from 'src/database/entities/trn-sale-schedule.entity';
import { SaleScheduleService } from '../services/trn-sale-schedule.service';
import { SaleScheduleController } from '../controllers/trn-sale-schedule.controller';
import { SaleScheduleRepo } from '../repositories/trn-sale-schedule.repo';

@Module({
  imports: [TypeOrmModule.forFeature([SaleSchedule])],
  controllers: [SaleScheduleController],
  providers: [SaleScheduleService, SaleScheduleRepo],
  exports: [SaleScheduleService, SaleScheduleRepo],
})
export class SaleScheduleModule {}
