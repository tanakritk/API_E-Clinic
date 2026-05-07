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
  CreateMasterProductDto,
  UpdateMasterProductDto,
} from '../dto/mas-product.dto';
import { ResponseDataVm } from 'src/app/view-model/response-data.vm';
import { PaginationVm } from 'src/app/view-model/pagination.vm';
import { MasterProductService } from '../services/mas-product.service';
import { BaseSearchDto } from '../dto/base-search.dto';

@Controller('master-product')
export class MasterProductController {
  constructor(private masterProductService: MasterProductService) {}

  @Post('search')
  async search(@Body() body: BaseSearchDto) {
    try {
      const result = await this.masterProductService.search(body);
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
  async create(@Req() req: any, @Body() body: CreateMasterProductDto) {
    try {
      const file = req.files && req.files.length > 0 ? req.files[0] : null;

      const result = await this.masterProductService.create(body, file);
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiConsumes('multipart/form-data')
  @Put('/:id')
  async update(
    @Req() req: any,
    @Body() body: UpdateMasterProductDto,
    @Param('id') id: number,
  ) {
    try {
      const file = req.files && req.files.length > 0 ? req.files[0] : null;
      const result = await this.masterProductService.update(body, id, file);
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    try {
      const result = await this.masterProductService.delete(id);
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
      const result = await this.masterProductService.changeActiveStatus(
        id,
        isActive,
      );
      return ResponseDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  // ------------------------------------------------------------- //
  @Post('search-for-sele')
  async searchForSale(@Body() body: BaseSearchDto) {
    try {
      const result = await this.masterProductService.searchForSale(body);
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
}
