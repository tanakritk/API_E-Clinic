import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MasterUser } from 'src/database/entities/mas-user.entity';
import { Repository } from 'typeorm';
import { filterFunction } from 'src/helpers/function-filter';

@Injectable()
export class MasterUserRepo {
  constructor(
    @InjectRepository(MasterUser)
    private readonly repo: Repository<MasterUser>,
  ) {}

  async repoOriginal() {
    return this.repo;
  }

  async getItemById(id: number) {
    try {
      return await this.repo.findOne({ where: { id } });
    } catch (err) {
      throw new InternalServerErrorException(err.message + err?.query);
    }
  }

  async getLatestCode() {
    try {
      const lastItems = await this.repo.find({
        order: { id: 'DESC' },
        take: 1,
      });
      return lastItems.length > 0 ? lastItems[0].code : null;
    } catch (err) {
      throw new InternalServerErrorException(err.message + err?.query);
    }
  }

  async findCondition(model: any) {
    try {
      return await this.repo.find(model);
    } catch (err) {
      throw new InternalServerErrorException(err.message + err?.query);
    }
  }

  async findData(body: any) {
    try {
      const { conditionValue, relationValue, sortingValue } =
        await filterFunction(body);
      const [data, count] = await this.repo.findAndCount({
        relations: relationValue,
        where: conditionValue,
        order: sortingValue,
        skip: (body.page - 1) * body.limit,
        take: body.limit,
      });
      return { data, totalItem: count };
    } catch (err) {
      throw new InternalServerErrorException(err.message + err?.query);
    }
  }

  async findByUsername(username: string) {
    try {
      return await this.repo.findOne({
        where: { username: username, isActive: true },
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message + err?.query);
    }
  }

  async save(body: any) {
    try {
      return await this.repo.save(body);
    } catch (err) {
      throw new InternalServerErrorException(err.message + err?.query);
    }
  }

  async softDelete(Id: number) {
    try {
      return await this.repo.softDelete(Id);
    } catch (err) {
      throw new InternalServerErrorException(err.message + err?.query);
    }
  }
}
