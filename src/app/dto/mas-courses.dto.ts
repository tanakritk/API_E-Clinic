import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CourseProductDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 3 })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CreateMasterCoursesDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ example: 'Course A' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  numberOfTimes: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  commission?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: [CourseProductDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseProductDto)
  coursesProduct?: CourseProductDto[];
}

export class UpdateMasterCoursesDto extends PartialType(
  CreateMasterCoursesDto,
) {}
