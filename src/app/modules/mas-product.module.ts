import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterProduct } from 'src/database/entities/mas-product.entity';
import { MasterProductController } from '../controllers/mas-product.controller';
import { MasterProductService } from '../services/mas-product.service';
import { MasterProductRepo } from '../repositories/mas-product.repo';
import { FilesService } from '../services/files.service';
import { MasterCoursesModule } from './mas-courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MasterProduct]),
    forwardRef(() => MasterCoursesModule),
  ],
  controllers: [MasterProductController],
  providers: [MasterProductService, MasterProductRepo, FilesService],
  exports: [MasterProductService, MasterProductRepo],
})
export class MasterProductModule {}
