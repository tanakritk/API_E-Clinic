import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'node:crypto';
// import { UserRepository } from "../repository/user.repository";
import { JwtService } from '@nestjs/jwt';
import { MasterUserRepo } from '../repositories/mas-user.repo';

@Injectable()
export class AuthService {
  constructor(
    private readonly masterUserRepo: MasterUserRepo,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const hash = crypto
      .createHmac('sha256', process.env.APP_PASSWORD_KEY)
      .update(password)
      .digest('hex');
    return hash;
  }

  async login(username: string, password: string) {
    // const user = await this.masterUserRepo.findByUsername(username);
    const result = await this.masterUserRepo.findCondition({
      where: {
        username: username,
      },
      relations: {
        mas_branch: true,
      },
    });
    if (result?.length == 0) {
      throw new InternalServerErrorException(`ไม่พบผู้ใช้งาน ${username}`);
    } else {
      if (result[0].password !== (await this.hashPassword(password))) {
        throw new InternalServerErrorException(`รหัสผ่านไม่ถูกต้อง`);
      }
      const payload = { ...result[0] };
      const access_token = await this.jwtService.signAsync(payload);
      return { token: access_token, user: result[0] };
    }
  }

  async loginByUsername(username: string) {
    // const user = await this.masterUserRepo.findByUsername(username);
    const result = await this.masterUserRepo.findCondition({
      where: {
        username: username,
      },
      relations: {
        mas_branch: true,
      },
    });
    if (result?.length == 0) {
      throw new InternalServerErrorException(`ไม่พบผู้ใช้งาน ${username}`);
    }
    const payload = { ...result[0] };
    const access_token = await this.jwtService.signAsync(payload);
    return { token: access_token, user: result[0] };
  }
}
