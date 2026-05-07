import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMasterProductDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ example: 'Product A' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  price: number;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  files?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateMasterProductDto extends PartialType(
  CreateMasterProductDto,
) {}
