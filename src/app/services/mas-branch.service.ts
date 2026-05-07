import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MasterBranchRepo } from '../repositories/mas-branch.repo';
import {
  CreateMasterBranchDto,
  UpdateMasterBranchDto,
} from '../dto/mas-branch.dto';
import { FilesService } from './files.service';
import { MasterUserRepo } from '../repositories/mas-user.repo';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class MasterBranchService {
  constructor(
    private masterBranchRepo: MasterBranchRepo,
    private filesService: FilesService,
    private masterUserRepo: MasterUserRepo,
  ) {}

  async search(body: any) {
    const result = await this.masterBranchRepo.findData(body);
    return { data: result.data, totalItem: result.totalItem };
  }

  async create(body: CreateMasterBranchDto, file?: any) {
    const latestCode = await this.masterBranchRepo.getLatestCode();
    let nextNumber = 1;

    if (latestCode && latestCode.startsWith('BRN')) {
      const numericPart = parseInt(latestCode.substring(3), 10);
      if (!isNaN(numericPart)) {
        nextNumber = numericPart + 1;
      }
    }

    const generatedCode = 'BRN' + nextNumber.toString().padStart(10, '0');

    // Add generated code to the body before saving
    body.code = generatedCode;

    const result = await this.masterBranchRepo.save(body);

    if (file) {
      try {
        const fileExt = path.extname(file.originalname);
        const remoteFilePath = `files/qrcode-branch/${result.id}${fileExt}`;

        await this.filesService.uploadFile(file.path, remoteFilePath);

        result.qrFileName = file.filename;
        result.qrFilePath = remoteFilePath;
        result.qrFileOriginalName = file.originalname;
        result.qrFileType = file.mimetype;

        await this.masterBranchRepo.save(result);

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

  async update(body: UpdateMasterBranchDto, id: number, file?: any) {
    const resultCheck = await this.masterBranchRepo.getItemById(id);
    if (!resultCheck) {
      throw new InternalServerErrorException('Data not found');
    }
    Object.assign(resultCheck, body);
    const result = await this.masterBranchRepo.save(resultCheck);

    if (file) {
      try {
        const fileExt = path.extname(file.originalname);
        const remoteFilePath = `files/qrcode-branch/${result.id}${fileExt}`;

        await this.filesService.uploadFile(file.path, remoteFilePath);

        result.qrFileName = file.filename;
        result.qrFilePath = remoteFilePath;
        result.qrFileOriginalName = file.originalname;
        result.qrFileType = file.mimetype;

        await this.masterBranchRepo.save(result);

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
    const resultCheck = await this.masterBranchRepo.getItemById(id);
    if (!resultCheck) {
      throw new InternalServerErrorException('Data not found');
    }

    if (resultCheck.qrFilePath) {
      try {
        await this.filesService.deleteFile(resultCheck.qrFilePath);
      } catch (err) {
        console.error('Failed to delete associated file:', err.message);
      }
    }

    return await this.masterBranchRepo.softDelete(id);
  }

  async changeActiveStatus(id: number, isActive: boolean) {
    const resultCheck = await this.masterBranchRepo.getItemById(id);
    if (!resultCheck) {
      throw new InternalServerErrorException('Data not found');
    }
    resultCheck.isActive = isActive;

    if (isActive === false) {
      const usersInBranch = await this.masterUserRepo.findCondition({
        where: { mas_branch: { id: id } },
      });
      if (usersInBranch && usersInBranch.length > 0) {
        for (const user of usersInBranch) {
          user.isActive = false;
        }
        await this.masterUserRepo.save(usersInBranch);
      }
    }

    return await this.masterBranchRepo.save(resultCheck);
  }
}
