import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { System } from 'src/database/entities/system.entity';
import { SystemController } from '../controllers/system.controller';
import { SystemService } from '../services/system.service';
import { SystemRepo } from '../repositories/system.repo';

@Module({
  imports: [TypeOrmModule.forFeature([System])],
  controllers: [SystemController],
  providers: [SystemService, SystemRepo],
  exports: [SystemService, SystemRepo],
})
export class SystemModule {}
