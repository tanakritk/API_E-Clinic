import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterCustomer } from 'src/database/entities/mas-customer.entity';
import { MasterCustomerController } from '../controllers/mas-customer.controller';
import { MasterCustomerService } from '../services/mas-customer.service';
import { MasterCustomerRepo } from '../repositories/mas-customer.repo';

@Module({
  imports: [TypeOrmModule.forFeature([MasterCustomer])],
  controllers: [MasterCustomerController],
  providers: [MasterCustomerService, MasterCustomerRepo],
  exports: [MasterCustomerService, MasterCustomerRepo],
})
export class MasterCustomerModule {}
