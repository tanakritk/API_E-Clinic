import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterUserModule } from './mas-user.module';
import { DropdownController } from '../controllers/dropdown.controller';
import { DropdownService } from '../services/dropdown.service';
import { MasterProductModule } from './mas-product.module';
import { MasterBranchModule } from './mas-branch.module';
import { MasterCoursesModule } from './mas-courses.module';

@Module({
  imports: [
    forwardRef(() => MasterUserModule),
    forwardRef(() => MasterProductModule),
    forwardRef(() => MasterBranchModule),
    forwardRef(() => MasterCoursesModule),
  ],
  controllers: [DropdownController],
  providers: [DropdownService],
  exports: [DropdownService],
})
export class DropdownModule {}
