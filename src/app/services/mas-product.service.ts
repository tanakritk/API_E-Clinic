import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MasterProductRepo } from '../repositories/mas-product.repo';
import {
  CreateMasterProductDto,
  UpdateMasterProductDto,
} from '../dto/mas-product.dto';
import { FilesService } from './files.service';
import * as path from 'path';
import * as fs from 'fs';
import { CoursesProductRepo } from '../repositories/courses-product.repo';

@Injectable()
export class MasterProductService {
  constructor(
    private masterProductRepo: MasterProductRepo,
    private filesService: FilesService,
    private coursesProductRepo: CoursesProductRepo,
  ) {}

  async search(body: any) {
    const result = await this.masterProductRepo.findData(body);
    return { data: result.data, totalItem: result.totalItem };
  }

  async create(body: CreateMasterProductDto, file?: any) {
    const latestCode = await this.masterProductRepo.getLatestCode();
    let nextNumber = 1;

    // Use PRD for product
    if (latestCode && latestCode.startsWith('PRD')) {
      const numericPart = parseInt(latestCode.substring(3), 10);
      if (!isNaN(numericPart)) {
        nextNumber = numericPart + 1;
      }
    }

    body.code = 'PRD' + nextNumber.toString().padStart(10, '0');

    // Convert price to number if it came from FormData as a string
    if (typeof body.price === 'string') {
      body.price = parseFloat(body.price);
    }

    const result = await this.masterProductRepo.save(body);

    if (file) {
      try {
        const fileExt = path.extname(file.originalname);
        const remoteFilePath = `files/product/${result.id}${fileExt}`;

        await this.filesService.uploadFile(file.path, remoteFilePath);

        result.fileName = file.filename;
        result.filePath = remoteFilePath;
        result.fileOriginalName = file.originalname;
        result.fileType = file.mimetype;

        await this.masterProductRepo.save(result);

        // optional cleanup
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (err) {
        throw new InternalServerErrorException(
          'บันทึกข้อมูลสำเร็จ แต่อัปโหลดรูปภาพไม่ผ่าน: ' + err.message,
        );
      }
    }

    return result;
  }

  async update(body: UpdateMasterProductDto, id: number, file?: any) {
    const resultCheck = await this.masterProductRepo.getItemById(id);
    if (!resultCheck) {
      throw new InternalServerErrorException('Data not found');
    }

    if (typeof body.price === 'string') {
      body.price = parseFloat(body.price);
    }

    Object.assign(resultCheck, body);
    const result = await this.masterProductRepo.save(resultCheck);

    if (file) {
      try {
        const fileExt = path.extname(file.originalname);
        const remoteFilePath = `files/product/${result.id}${fileExt}`;

        await this.filesService.uploadFile(file.path, remoteFilePath);

        result.fileName = file.filename;
        result.filePath = remoteFilePath;
        result.fileOriginalName = file.originalname;
        result.fileType = file.mimetype;

        await this.masterProductRepo.save(result);

        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (err) {
        throw new InternalServerErrorException(
          'อัปเดตข้อมูลสำเร็จ แต่อัปโหลดรูปภาพไม่ผ่าน: ' + err.message,
        );
      }
    }

    return result;
  }

  async delete(id: number) {
    const resultCheck = await this.masterProductRepo.getItemById(id);
    if (!resultCheck) {
      throw new InternalServerErrorException('Data not found');
    }

    if (resultCheck.filePath) {
      try {
        await this.filesService.deleteFile(resultCheck.filePath);
      } catch (err) {
        // Log the error but proceed with soft deleting the record to prevent blocking DB operations
        console.error('Failed to delete associated file:', err.message);
      }
    }

    return await this.masterProductRepo.softDelete(id);
  }

  async changeActiveStatus(id: number, isActive: boolean) {
    const resultCheck = await this.masterProductRepo.getItemById(id);
    if (!resultCheck) {
      throw new InternalServerErrorException('Data not found');
    }
    resultCheck.isActive = isActive;

    if (isActive === false) {
      await this.coursesProductRepo.deleteByProductId(id);
    }

    return await this.masterProductRepo.save(resultCheck);
  }

  // -------------------------------------------------------------------------- //

  async searchForSale(body: any) {
    const result = await this.masterProductRepo.findData(body);
    const mapPart = await Promise.all(
      result.data.map(async (item) => {
        const base64 = await this.filesService.downloadFileAsBase64AndType(
          item.filePath,
        );
        return {
          ...item,
          base64: base64,
        };
      })
    );
    return { data: mapPart, totalItem: result.totalItem };
  }
}
