import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from 'src/database/entities/trn-stock.entity';
import { Repository } from 'typeorm';
import { filterFunction } from 'src/helpers/function-filter';

@Injectable()
export class StockRepo {
  constructor(
    @InjectRepository(Stock)
    private readonly repo: Repository<Stock>,
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

  async findConditionAndCount(model: any) {
    try {
      return await this.repo.findAndCount(model);
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

  async findCondition(model: any) {
    try {
      return await this.repo.find(model);
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

  async softDelete(id: number) {
    try {
      return await this.repo.softDelete(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message + err?.query);
    }
  }
}
