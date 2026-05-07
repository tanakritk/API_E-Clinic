import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MasterCoursesRepo } from '../repositories/mas-courses.repo';
import { CoursesProductRepo } from '../repositories/courses-product.repo';
import {
  CreateMasterCoursesDto,
  UpdateMasterCoursesDto,
} from '../dto/mas-courses.dto';

@Injectable()
export class MasterCoursesService {
  constructor(
    private masterCoursesRepo: MasterCoursesRepo,
    private coursesProductRepo: CoursesProductRepo,
  ) {}

  async search(body: any) {
    const result = await this.masterCoursesRepo.findData(body);
    return { data: result.data, totalItem: result.totalItem };
  }

  async create(body: CreateMasterCoursesDto) {
    const latestCode = await this.masterCoursesRepo.getLatestCode();
    let nextNumber = 1;

    if (latestCode && latestCode.startsWith('COS')) {
      const numericPart = parseInt(latestCode.substring(3), 10);
      if (!isNaN(numericPart)) {
        nextNumber = numericPart + 1;
      }
    }

    body.code = 'COS' + nextNumber.toString().padStart(10, '0');

    const { coursesProduct, ...courseData } = body;

    const result = await this.masterCoursesRepo.save(courseData);

    if (
      coursesProduct &&
      Array.isArray(coursesProduct) &&
      coursesProduct.length > 0
    ) {
      for (const item of coursesProduct) {
        await this.coursesProductRepo.save({
          quantity: item.quantity,
          mas_courses: { id: result.id },
          mas_product: { id: item.productId },
        });
      }
    }

    return result;
  }

  async update(body: UpdateMasterCoursesDto, id: number) {
    const resultCheck = await this.masterCoursesRepo.getItemById(id);
    if (!resultCheck) {
      throw new InternalServerErrorException('Data not found');
    }

    const { coursesProduct, ...courseData } = body;

    Object.assign(resultCheck, courseData);
    const result = await this.masterCoursesRepo.save(resultCheck);

    if (
      coursesProduct &&
      Array.isArray(coursesProduct) &&
      coursesProduct.length > 0
    ) {
      await this.coursesProductRepo.deleteByCourseId(id);
      for (const item of coursesProduct) {
        await this.coursesProductRepo.save({
          quantity: item.quantity,
          mas_courses: { id: result.id },
          mas_product: { id: item.productId },
        });
      }
    }

    return result;
  }

  async delete(id: number) {
    const resultCheck = await this.masterCoursesRepo.getItemById(id);
    if (!resultCheck) {
      throw new InternalServerErrorException('Data not found');
    }

    return await this.masterCoursesRepo.softDelete(id);
  }

  async changeActiveStatus(id: number, isActive: boolean) {
    const resultCheck = await this.masterCoursesRepo.getItemById(id);
    if (!resultCheck) {
      throw new InternalServerErrorException('Data not found');
    }
    resultCheck.isActive = isActive;
    return await this.masterCoursesRepo.save(resultCheck);
  }
}
