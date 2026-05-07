import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BaseSearchDto } from './base-search.dto';
import { Type } from 'class-transformer';
import { ItemTypeEnum } from '../enum/trn-sale-item.enum';
import { PaymentEnum } from '../enum/trn-sale.enum';

class AdvanceFilterSaleDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  branchId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  customerId?: number;
}

export class SearchSaleDto extends BaseSearchDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AdvanceFilterSaleDto)
  advanceFilter?: AdvanceFilterSaleDto;
}

export class SaleScheduleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  time: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isFree: boolean;
}

export class SaleItemDto {
  @ApiProperty({ enum: ItemTypeEnum })
  @IsNotEmpty()
  @IsEnum(ItemTypeEnum)
  itemType: ItemTypeEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  courseId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  productId?: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  @ApiProperty({ type: [SaleScheduleDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleScheduleDto)
  schedules?: SaleScheduleDto[];
}

export class CreateSaleDto {
  // @ApiProperty({ required: false })
  // @IsOptional()
  // @IsString()
  // receiptNo?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  vat: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  saleDate: Date;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  branchId: number;

  // @ApiProperty({ required: true })
  // @IsNotEmpty()
  // @IsNumber()
  // createBy: number;

  @ApiProperty({ type: [SaleItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];

  @ApiProperty({ enum: PaymentEnum })
  @IsNotEmpty()
  @IsEnum(PaymentEnum)
  payment: PaymentEnum;
}

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;
}
