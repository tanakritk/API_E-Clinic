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
  CreateStockDto,
  SearchStockDto,
  UpdateStockDto,
} from '../dto/trn-stock.dto';
import { ResponseDataVm } from 'src/app/view-model/response-data.vm';
import { PaginationVm } from 'src/app/view-model/pagination.vm';
import { StockService } from '../services/trn-stock.service';

@Controller('stock')
export class StockController {
  constructor(private stockService: StockService) {}

  @Post('search')
  async search(@Body() body: SearchStockDto) {
    try {
      const result = await this.stockService.search(body);
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
  async create(@Body() body: CreateStockDto) {
    try {
      const result = await this.stockService.create(body);
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Post('import')
  async import(@Body() body: CreateStockDto) {
    try {
      const result = await this.stockService.import(body);
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Put('/:id')
  async update(@Body() body: UpdateStockDto, @Param('id') id: number) {
    try {
      const result = await this.stockService.update(body, id);
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    try {
      const result = await this.stockService.delete(id);
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
