import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { FilterOperetorEnum, OperetorEnum } from '../enum/operetor.enum';
import { ApiProperty } from '@nestjs/swagger';

export class BaseSearchDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'page ต้องไม่เป็นค่าว่าง' })
  page: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'limit ต้องไม่เป็นค่าว่าง' })
  limit: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'filterOperator ต้องไม่เป็นค่าว่าง' })
  @IsEnum(FilterOperetorEnum)
  filterOperator: string;

  @ApiProperty()
  @IsOptional()
  @IsArray({ message: 'relation ต้องเป็น array' })
  relation: string[];

  @ApiProperty({
    type: () => SortingModelDto,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'sorting ต้องเป็น array' })
  sorting: SortingModelDto[];

  @ApiProperty({
    type: () => FilterModelDto,
    isArray: true,
    required: false,
  })
  @IsNotEmpty({ message: 'filter ต้องไม่เป็นค่าว่าง' })
  @IsArray({ message: 'filter ต้องเป็น array' })
  filter: FilterModelDto[];
}

export class FilterModelDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'field ต้องไม่เป็นค่าว่าง' })
  field: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'operator ต้องไม่เป็นค่าว่าง' })
  @IsEnum(OperetorEnum)
  operator: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'value ต้องไม่เป็นค่าว่าง' })
  value: string | number | Date | string[] | number[] | Date[];
}

export class SortingModelDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'field ต้องไม่เป็นค่าว่าง' })
  field: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'pattern ต้องไม่เป็นค่าว่าง' })
  pattern: string;
}
