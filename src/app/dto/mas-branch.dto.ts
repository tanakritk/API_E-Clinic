import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMasterBranchDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ example: 'Branch A' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  taxIdNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  qrFileName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  qrFilePath?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  qrFileOriginalName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  qrFileType?: string;

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

export class UpdateMasterBranchDto extends PartialType(CreateMasterBranchDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  id?: number;
}
