import { forwardRef, Module } from "@nestjs/common";
// import { AuthService } from "../service/auth.service";
// import { UserModule } from "./user.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";
import { MasterUserModule } from "./mas-user.module";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.APP_JWT_SIGNATURE,
            signOptions: { expiresIn: '1d' },
            // signOptions: { expiresIn: '5s' },
        }),
        forwardRef(()=>MasterUserModule),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})

export class AuthModule { }