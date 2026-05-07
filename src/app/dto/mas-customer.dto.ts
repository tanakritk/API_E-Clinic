import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BaseSearchDto } from './base-search.dto';
import { Type } from 'class-transformer';

class AdvanceFilterMasterCustomerDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isNew?: boolean; // ลูกค้าใหม่ หรือไม่
}

export class SearchMasterCustomerDto extends BaseSearchDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AdvanceFilterMasterCustomerDto)
  advanceFilter?: AdvanceFilterMasterCustomerDto;
}

export class CreateMasterCustomerDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ example: 'นาย' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstname?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdateMasterCustomerDto extends PartialType(
  CreateMasterCustomerDto,
) {}
