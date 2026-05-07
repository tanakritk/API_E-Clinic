import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterCourses } from 'src/database/entities/mas-courses.entity';
import { CoureseProduct } from 'src/database/entities/courses-product.entity';
import { MasterCoursesRepo } from '../repositories/mas-courses.repo';
import { CoursesProductRepo } from '../repositories/courses-product.repo';
import { MasterCoursesService } from '../services/mas-courses.service';
import { MasterCoursesController } from '../controllers/mas-courses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MasterCourses, CoureseProduct])],
  controllers: [MasterCoursesController],
  providers: [
    MasterCoursesRepo,
    CoursesProductRepo,
    MasterCoursesService,
  ],
  exports: [MasterCoursesRepo, CoursesProductRepo],
})
export class MasterCoursesModule {}
