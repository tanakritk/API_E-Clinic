import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BaseSearchDto } from './base-search.dto';
import { Type } from 'class-transformer';

class AdvanceFilterStockDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  branchId?: number; // ลูกค้าใหม่ หรือไม่
}

export class SearchStockDto extends BaseSearchDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AdvanceFilterStockDto)
  advanceFilter?: AdvanceFilterStockDto;
}

export class CreateStockDto {
  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  branchId: number;
}

export class UpdateStockDto extends PartialType(CreateStockDto) {}
