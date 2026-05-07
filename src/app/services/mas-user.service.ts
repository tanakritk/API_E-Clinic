import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateMasterUserDto,
  UpdateMasterUserDto,
  UpdatePasswordDto,
} from '../dto/mas-user.dto';
import { MasterUserRepo } from '../repositories/mas-user.repo';
import { configDotenv } from 'dotenv';
configDotenv({ path: '.env' });

@Injectable()
export class MasterUserService {
  constructor(
    private masterUserRepo: MasterUserRepo,
    private authService: AuthService,
  ) {}

  async search(body: any) {
    const result = await this.masterUserRepo.findData(body);
    const mapNotPassword = result.data.map((item) => {
      const { password, ...rest } = item;
      return rest;
    });
    return { data: mapNotPassword, totalItem: result.totalItem };
  }

  async create(body: CreateMasterUserDto) {
    const latestCode = await this.masterUserRepo.getLatestCode();
    let nextNumber = 1;

    if (latestCode && latestCode.startsWith('USR')) {
      const numericPart = parseInt(latestCode.substring(3), 10);
      if (!isNaN(numericPart)) {
        nextNumber = numericPart + 1;
      }
    }

    body.code = 'USR' + nextNumber.toString().padStart(10, '0');

    const hashPassword = await this.authService.hashPassword(
      process.env.APP_DEFAULT_PASSWORD,
    );
    const checkUsername = await this.masterUserRepo.findByUsername(
      body.username,
    );
    if (checkUsername) {
      throw new InternalServerErrorException('username นี้มีผู้ใช้งานแล้ว');
    }
    const newBody = {
      ...body,
      password: hashPassword,
      mas_branch: { id: body.branchId },
    };
    const result = await this.masterUserRepo.save(newBody);
    return result;
  }

  async update(body: UpdateMasterUserDto, Id: number) {
    const resultCheck = await this.masterUserRepo.getItemById(Id);
    if (!resultCheck) {
      throw new InternalServerErrorException('Data not found');
    }
    const { username, ...req } = body;
    let newPayload: any = req;
    if (req.branchId) {
      newPayload = {
        ...newPayload,
        mas_branch: {
          id: req.branchId,
        },
      };
    }
    Object.assign(resultCheck, newPayload);
    return await this.masterUserRepo.save(resultCheck);
  }

  async delete(id: number) {
    const resultCheck = await this.masterUserRepo.getItemById(id);
    if (!resultCheck) {
      throw new InternalServerErrorException('Data not found');
    }
    return await this.masterUserRepo.softDelete(id);
  }

  async resetPassword(id: number) {
    const resultCheck = await this.masterUserRepo.getItemById(id);
    if (!resultCheck) {
      throw new InternalServerErrorException('Data not found');
    }
    const newPassword = process.env.APP_DEFAULT_PASSWORD;
    resultCheck.password = await this.authService.hashPassword(newPassword);
    resultCheck.isRefactorPassword = false;
    return await this.masterUserRepo.save(resultCheck);
  }

  async updatePassword(body: UpdatePasswordDto, id: number) {
    const resultCheck = await this.masterUserRepo.getItemById(id);
    if (!resultCheck) {
      throw new InternalServerErrorException('Data not found');
    }
    resultCheck.password = await this.authService.hashPassword(body.password);
    resultCheck.isRefactorPassword = true;
    return await this.masterUserRepo.save(resultCheck);
  }

  async changeActiveStatus(id: number, isActive: boolean) {
    const resultCheck = await this.masterUserRepo.getItemById(id);
    if (!resultCheck) {
      throw new InternalServerErrorException('Data not found');
    }
    resultCheck.isActive = isActive;
    return await this.masterUserRepo.save(resultCheck);
  }
}
