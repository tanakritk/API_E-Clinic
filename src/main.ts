import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/modules/app.module';
import { configDotenv } from 'dotenv';
import * as express from 'express';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'reflect-metadata';

configDotenv({ path: '.env' });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('E-Clinic API')
    .setDescription('The E-Clinic API description')
    .setVersion('1.2')
    .addTag('api')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  //   app.useGlobalPipes(new ValidationPipe())
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // ให้ class-transformer ทำงานด้วย
      whitelist: true, // กรอง property ที่ไม่ได้อยู่ใน DTO ออก
      forbidNonWhitelisted: true, // ถ้าเจอ property แปลก ให้ throw error
    }),
  );
  app.enableCors();

  app.use(express.static(path.join(__dirname, '..', 'uploads')));
  await app.listen(parseInt(process.env.APP_PORT) || 9001);
}
bootstrap();
