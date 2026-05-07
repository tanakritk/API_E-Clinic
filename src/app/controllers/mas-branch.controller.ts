import {
  Body,
  Controller,
  Delete,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateMasterBranchDto,
  UpdateMasterBranchDto,
} from '../dto/mas-branch.dto';
import { ResponseDataVm } from 'src/app/view-model/response-data.vm';
import { PaginationVm } from 'src/app/view-model/pagination.vm';
import { MasterBranchService } from '../services/mas-branch.service';
import { BaseSearchDto } from '../dto/base-search.dto';

@Controller('master-branch')
export class MasterBranchController {
  constructor(private masterBranchService: MasterBranchService) {}

  @Post('search')
  async search(@Body() body: BaseSearchDto) {
    try {
      const result = await this.masterBranchService.search(body);
      const pagination = {
        page: Number(body.page),
        limit: Number(body.limit),
        totalItems: Number(result.totalItem),
      };
      return PaginationVm.convertToVm(result.data, pagination);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiConsumes('multipart/form-data')
  @Post('')
  async create(@Req() req: any, @Body() body: CreateMasterBranchDto) {
    try {
      const file = req.files && req.files.length > 0 ? req.files[0] : null;
      const result = await this.masterBranchService.create(body, file);
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiConsumes('multipart/form-data')
  @Put('/:id')
  async update(
    @Req() req: any,
    @Body() body: UpdateMasterBranchDto,
    @Param('id') id: number,
  ) {
    try {
      const file = req.files && req.files.length > 0 ? req.files[0] : null;
      const result = await this.masterBranchService.update(body, id, file);
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    try {
      const result = await this.masterBranchService.delete(id);
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Put('change-active/:id')
  async changeActiveStatus(
    @Param('id') id: number,
    @Body('isActive') isActive: boolean,
  ) {
    try {
      const result = await this.masterBranchService.changeActiveStatus(
        id,
        isActive,
      );
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
