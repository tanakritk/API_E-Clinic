import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoureseProduct } from 'src/database/entities/courses-product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CoursesProductRepo {
  constructor(
    @InjectRepository(CoureseProduct)
    private readonly repo: Repository<CoureseProduct>,
  ) {}

  async save(body: any) {
    try {
      return await this.repo.save(body);
    } catch (err) {
      throw new InternalServerErrorException(err.message + err?.query);
    }
  }

  async deleteByCourseId(courseId: number) {
    try {
      return await this.repo.delete({ mas_courses: { id: courseId } });
    } catch (err) {
      throw new InternalServerErrorException(err.message + err?.query);
    }
  }

  async deleteByProductId(productId: number) {
    try {
      return await this.repo.delete({ mas_product: { id: productId } });
    } catch (err) {
      throw new InternalServerErrorException(err.message + err?.query);
    }
  }

  async findByCourseId(courseId: number) {
    try {
      return await this.repo.find({
        where: { mas_courses: { id: courseId } },
        relations: ['mas_product'],
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message + err?.query);
    }
  }
}
