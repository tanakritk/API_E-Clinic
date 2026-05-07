import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsBooleanString,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { RoleEnum, SexEnum } from '../enum/mas-user.enum';

export class CreateMasterUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  username: string;

  // @ApiProperty({ example: 'xxxxxx123456' })
  // // @IsNotEmpty()
  // @IsOptional()
  // @IsString()
  // password?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

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
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  idCardNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({ required: false, example: '1990-01-01' })
  @IsOptional()
  @IsDateString() // ใช้ตรวจสอบรูปแบบวันที่ YYYY-MM-DD
  birthday?: string;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isRefactorPassword?: boolean;

  @ApiProperty({ required: false, enum: RoleEnum })
  @IsOptional()
  @IsEnum(RoleEnum) // หรือ @IsString() ตามประเภทข้อมูลของคุณ
  role?: RoleEnum;

  @ApiProperty({ required: false, enum: SexEnum })
  @IsOptional()
  @IsEnum(SexEnum)
  sex?: SexEnum;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsNumber()
  branchId?: number;
}

export class UpdateMasterUserDto extends PartialType(CreateMasterUserDto) {}

export class UpdatePasswordDto {
  @ApiProperty({ example: 'xxxxxx123456' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

// -------------------------------------------------------------------------------- //
