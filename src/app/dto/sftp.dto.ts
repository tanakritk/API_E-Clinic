import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class GetSftpBody {
    @ApiProperty()
    @IsOptional({message: 'path ต้องไม่เป็นค่าว่าง'})
    @IsString({message: 'path ต้องเป็นชนิดตัวอักษร'})
    path: string
}