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
import {
  CreateSaleDto,
  SearchSaleDto,
  UpdateSaleDto,
} from '../dto/trn-sale.dto';
import { ResponseDataVm } from 'src/app/view-model/response-data.vm';
import { PaginationVm } from 'src/app/view-model/pagination.vm';
import { SaleService } from '../services/trn-sale.service';

@Controller('sale')
export class SaleController {
  constructor(private saleService: SaleService) {}

  @Post('search')
  async search(@Body() body: SearchSaleDto) {
    try {
      const result = await this.saleService.search(body);
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
  async create(@Body() body: CreateSaleDto, @Req() req: any) {
    try {
      const result = await this.saleService.create(body, Number(req?.user?.id));
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Put('/:id')
  async update(@Body() body: UpdateSaleDto, @Param('id') id: number) {
    try {
      const result = await this.saleService.update(body, id);
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    try {
      const result = await this.saleService.delete(id);
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
