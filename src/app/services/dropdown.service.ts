import { Injectable } from '@nestjs/common';
import { MasterUserRepo } from '../repositories/mas-user.repo';
import { MasterProductRepo } from '../repositories/mas-product.repo';
import { MasterBranchRepo } from '../repositories/mas-branch.repo';
import { MasterCoursesRepo } from '../repositories/mas-courses.repo';

@Injectable()
export class DropdownService {
  constructor(
    private readonly masterUserRepo: MasterUserRepo,
    private readonly masterProductRepo: MasterProductRepo,
    private readonly masterBranchRepo: MasterBranchRepo,
    private readonly masterCoursesRepo: MasterCoursesRepo,
  ) {}

  async getBranch() {
    const json = {
      where: {
        isActive: true,
      },
    };
    const result = await this.masterBranchRepo.findCondition(json);
    return result.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }

  async getUser() {
    const json = {
      where: {
        isActive: true,
      },
    };
    const result = await this.masterUserRepo.findCondition(json);
    return result.map((item) => {
      const title = item.title ? item.title : '';
      const firstname = item.firstname ? item.firstname : '';
      const surname = item.surname ? item.surname : '';
      return {
        label: `${title} ${firstname} ${surname}`,
        value: item.id,
      };
    });
  }

  async getProduct() {
    const json = {
      where: {
        isActive: true,
      },
    };
    const result = await this.masterProductRepo.findCondition(json);
    return result.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }

  async getCourses() {
    const json = {
      where: {
        isActive: true,
      },
    };
    const result = await this.masterCoursesRepo.findCondition(json);
    return result.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }
}
