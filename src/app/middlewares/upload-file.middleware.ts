import { Injectable, NestMiddleware } from '@nestjs/common';
import * as multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class UploadMiddleware implements NestMiddleware {
      private upload = multer({
        storage: diskStorage({
          destination: './uploads', // โฟลเดอร์ที่ใช้ในการบันทึกไฟล์
          filename: (req: any, file: any, cb: any) => {
            // กำหนดชื่อไฟล์ใหม่
            const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      }).single('file'); // รองรับการอัปโหลดไฟล์เดี่ยว

    use(req: Request, res: Response, next: NextFunction) {
        this.upload(req, res, function (err: any) {
            if (err) {
                return res.status(400).json({ message: 'Error uploading file', error: err.message });
            }
            next();
        });
    }
}