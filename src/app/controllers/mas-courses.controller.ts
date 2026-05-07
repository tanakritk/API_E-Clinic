import {
  Body,
  Controller,
  Delete,
  InternalServerErrorException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  CreateMasterCoursesDto,
  UpdateMasterCoursesDto,
} from '../dto/mas-courses.dto';
import { ResponseDataVm } from 'src/app/view-model/response-data.vm';
import { PaginationVm } from 'src/app/view-model/pagination.vm';
import { MasterCoursesService } from '../services/mas-courses.service';
import { BaseSearchDto } from '../dto/base-search.dto';

@Controller('master-courses')
export class MasterCoursesController {
  constructor(private masterCoursesService: MasterCoursesService) {}

  @Post('search')
  async search(@Body() body: BaseSearchDto) {
    try {
      const result = await this.masterCoursesService.search(body);
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

  @Post('')
  async create(@Body() body: CreateMasterCoursesDto) {
    try {
      const result = await this.masterCoursesService.create(body);
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Put('/:id')
  async update(@Body() body: UpdateMasterCoursesDto, @Param('id') id: number) {
    try {
      const result = await this.masterCoursesService.update(body, id);
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    try {
      const result = await this.masterCoursesService.delete(id);
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
      const result = await this.masterCoursesService.changeActiveStatus(
        id,
        isActive,
      );
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
