import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterBranch } from 'src/database/entities/mas-branch.entity';
import { MasterBranchController } from '../controllers/mas-branch.controller';
import { MasterBranchService } from '../services/mas-branch.service';
import { MasterBranchRepo } from '../repositories/mas-branch.repo';
import { FilesService } from '../services/files.service';
import { MasterUserModule } from './mas-user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MasterBranch]),
    forwardRef(() => MasterUserModule),
  ],
  controllers: [MasterBranchController],
  providers: [MasterBranchService, MasterBranchRepo, FilesService],
  exports: [MasterBranchService, MasterBranchRepo],
})
export class MasterBranchModule {}
