import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  Patch,
} from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { UploadMiddleware } from '../middlewares/upload-file.middleware';
import { JwtAuthMiddleware } from '../middlewares/jwt.middleware';
import { UploadMultiFilesMiddleware } from '../middlewares/upload-multi-file.middleware';
import { TestController } from '../controllers/test.controller';
import { JwtService } from '@nestjs/jwt';
import { MasterUserModule } from './mas-user.module';
import { AuthModule } from './auth.module';
import { FilesModule } from './files.module';
import { DropdownModule } from './dropdown.module';
import { SystemModule } from './system.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MasterBranchModule } from './mas-branch.module';
import { MasterProductModule } from './mas-product.module';
import { MasterCustomerModule } from './mas-customer.module';
import { MasterCoursesModule } from './mas-courses.module';
import { StockModule } from './trn-stock.module';
import { SaleModule } from './trn-sale.module';
import { SaleScheduleModule } from './trn-sale-schedule.module';
@Module({
  imports: [
    DatabaseModule,
    FilesModule,
    AuthModule,
    DropdownModule,
    MasterUserModule,
    SystemModule,
    MasterBranchModule,
    MasterProductModule,
    MasterCustomerModule,
    MasterCoursesModule,
    StockModule,
    SaleModule,
    SaleScheduleModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [TestController],
  providers: [JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UploadMiddleware) // ใช้ Middleware
      .forRoutes
      // { method: RequestMethod.POST, path: 'strategic-plan' },
      // { method: RequestMethod.PATCH, path: 'strategic-plan/:id' },
      // { method: RequestMethod.POST, path: 'formtarget/upload-file-smartform/:targetId' },

      // { method: RequestMethod.POST, path: 'activity/import-holiday' },
      // { method: RequestMethod.POST, path: 'project' },
      // { method: RequestMethod.PATCH, path: 'project/:id' },

      // { method: RequestMethod.PATCH, path: 'master-car/:Id' },
      ()
      .apply(UploadMultiFilesMiddleware)
      .forRoutes(
        { method: RequestMethod.POST, path: 'document' },
        { method: RequestMethod.POST, path: 'master-product' },
        { method: RequestMethod.PUT, path: 'master-product/:id' },
        { method: RequestMethod.POST, path: 'master-branch' },
        { method: RequestMethod.PUT, path: 'master-branch/:id' },
        // { method: RequestMethod.PATCH, path: 'activity/:id' },
        // { method: RequestMethod.POST, path: 'formtarget/upload-file-fiscalyear' },
        // { method: RequestMethod.POST, path: 'reporting' },
        // { method: RequestMethod.PATCH, path: 'reporting/:id' },

        // { method: RequestMethod.PATCH, path: 'trn-repair/:Id' },
        // { method: RequestMethod.POST, path: 'file-management/upload-file/:folderId?' },
      )
      .apply(JwtAuthMiddleware)
      .exclude(
        { path: '/test', method: RequestMethod.GET },
        { path: '/auth/login', method: RequestMethod.POST },
        { path: '/auth/login-byusername', method: RequestMethod.POST },
        // { path: '/master-user', method: RequestMethod.POST },
        // { path: '/master-user/:id', method: RequestMethod.PUT },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
