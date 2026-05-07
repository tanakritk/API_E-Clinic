import {
  Body,
  Controller,
  Delete,
  InternalServerErrorException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateMasterCustomerDto,
  SearchMasterCustomerDto,
  UpdateMasterCustomerDto,
} from '../dto/mas-customer.dto';
import { ResponseDataVm } from 'src/app/view-model/response-data.vm';
import { PaginationVm } from 'src/app/view-model/pagination.vm';
import { MasterCustomerService } from '../services/mas-customer.service';
import { BaseSearchDto } from '../dto/base-search.dto';

@Controller('master-customer')
export class MasterCustomerController {
  constructor(private masterCustomerService: MasterCustomerService) {}

  @Post('search')
  async search(@Body() body: SearchMasterCustomerDto) {
    try {
      const result = await this.masterCustomerService.search(body);
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
  async create(@Body() body: CreateMasterCustomerDto) {
    try {
      const result = await this.masterCustomerService.create(body);
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Put('/:id')
  async update(@Body() body: UpdateMasterCustomerDto, @Param('id') id: number) {
    try {
      const result = await this.masterCustomerService.update(body, id);
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    try {
      const result = await this.masterCustomerService.delete(id);
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
