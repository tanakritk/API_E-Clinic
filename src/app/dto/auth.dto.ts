import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'username ต้องไม่เป็นค่าว่าง' })
    @IsString()
    username: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'password ต้องไม่เป็นค่าว่าง' })
    @IsString()
    password: string;
}

export class LoginByUsernameDto{
    @ApiProperty()
    @IsNotEmpty({ message: 'Username ต้องไม่เป็นค่าว่าง' })
    @IsString()
    username: string
}