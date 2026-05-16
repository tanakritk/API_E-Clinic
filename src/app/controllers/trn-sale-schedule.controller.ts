import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SaleScheduleService } from '../services/trn-sale-schedule.service';
import {
  CreateSaleScheduleDto,
  SearchSaleScheduleDto,
  UpdateSaleScheduleDto,
} from '../dto/trn-sale-schedule.dto';
import { ResponseDataVm } from 'src/app/view-model/response-data.vm';
import { PaginationVm } from 'src/app/view-model/pagination.vm';
import { ResponseOriginalDataVm } from '../view-model/response-original-data.vm';

@Controller('sale-schedule')
export class SaleScheduleController {
  constructor(private readonly saleScheduleService: SaleScheduleService) {}

  @Post('search')
  async search(@Body() body: SearchSaleScheduleDto) {
    try {
      const result = await this.saleScheduleService.search(body);
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
  async create(@Body() body: CreateSaleScheduleDto) {
    try {
      const result = await this.saleScheduleService.create(body);
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Put('/:id')
  async update(@Body() body: UpdateSaleScheduleDto, @Param('id') id: number) {
    try {
      const result = await this.saleScheduleService.update(body, id);
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    try {
      const result = await this.saleScheduleService.delete(id);
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Get('bill-detail/:saleItemId')
  async getBillDetail(@Param('saleItemId') saleItemId: number) {
    try {
      const result = await this.saleScheduleService.getBillDetail(saleItemId);
      return ResponseOriginalDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
