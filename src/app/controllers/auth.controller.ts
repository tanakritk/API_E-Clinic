import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { LoginByUsernameDto, LoginDto } from "../dto/auth.dto";
import { ResponseAuthVm } from "../view-model/response-auth.vm";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}
    
    @Post('login')
    async login(@Body() body: LoginDto) {
        const {token, user} = await this.authService.login(body.username, body.password)
        return ResponseAuthVm.convertToVm(token, user)
    }

    @Post('login-byusername')
    async loginByUsername(@Body() body: LoginByUsernameDto){
        const {token, user} = await this.authService.loginByUsername(body.username)
        return ResponseAuthVm.convertToVm(token, user)
    }
}