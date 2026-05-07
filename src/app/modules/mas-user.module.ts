import { forwardRef, Module } from "@nestjs/common";
import { MasterUserController } from "../controllers/mas-user.controller";
import { MasterUserService } from "../services/mas-user.service";
import { MasterUser } from "src/database/entities/mas-user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth.module";
import { MasterUserRepo } from "../repositories/mas-user.repo";

@Module({
    imports: [TypeOrmModule.forFeature([MasterUser]), forwardRef(() => AuthModule)],
    controllers: [MasterUserController],
    providers: [MasterUserService, MasterUserRepo],
    exports: [MasterUserService, MasterUserRepo],
})

export class MasterUserModule { }