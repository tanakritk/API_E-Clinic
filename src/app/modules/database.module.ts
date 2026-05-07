import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceOption } from "src/database/config/database.config";



@Module({
    imports: [TypeOrmModule.forRoot(dataSourceOption)],
})

export class DatabaseModule { }