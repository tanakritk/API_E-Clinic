import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BaseSearchDto } from './base-search.dto';
import { StatusSaleScheduleEnum } from '../enum/trn-sale-schedule.enum';
import { Type } from 'class-transformer';

class AdvanceFilterSaleScheduleDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  saleItemId?: number;
}

export class SearchSaleScheduleDto extends BaseSearchDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AdvanceFilterSaleScheduleDto)
  advanceFilter?: AdvanceFilterSaleScheduleDto;
}

export class CreateSaleScheduleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  sessionNumber: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  scheduleDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  scheduleTime: string;

  @ApiProperty({ enum: StatusSaleScheduleEnum, default: StatusSaleScheduleEnum.PENDING })
  @IsOptional()
  @IsEnum(StatusSaleScheduleEnum)
  status?: StatusSaleScheduleEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  saleItemId: number;
}

export class UpdateSaleScheduleDto extends PartialType(CreateSaleScheduleDto) {}
