import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MasterCustomerRepo } from '../repositories/mas-customer.repo';
import {
  CreateMasterCustomerDto,
  SearchMasterCustomerDto,
  UpdateMasterCustomerDto,
} from '../dto/mas-customer.dto';
import { filterFunction } from 'src/helpers/function-filter';
import { Between } from 'typeorm';

@Injectable()
export class MasterCustomerService {
  constructor(private masterCustomerRepo: MasterCustomerRepo) {}

  async search(body: SearchMasterCustomerDto) {
    // const result = await this.masterCustomerRepo.findData(body);
    // return { data: result.data, totalItem: result.totalItem };
    let { conditionValue, relationValue, sortingValue } =
      await filterFunction(body);

    if (body.advanceFilter?.isNew === true) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const dateCondition = { createdDate: Between(start, end) };

      if (Array.isArray(conditionValue)) {
        if (conditionValue.length === 0) {
          conditionValue = [dateCondition];
        } else {
          conditionValue = conditionValue.map((cond) => ({
            ...cond,
            ...dateCondition,
          }));
        }
      } else {
        conditionValue = { ...conditionValue, ...dateCondition };
      }
    }

    // const newCondition = { conditionValue };
    const model = {
      relations: relationValue,
      where: conditionValue,
      order: sortingValue,
      skip: (body.page - 1) * body.limit,
      take: body.limit,
    };

    const [data, count] =
      await this.masterCustomerRepo.findConditionAndCount(model);
    return { data, totalItem: count };
  }

  async create(body: CreateMasterCustomerDto) {
    const latestCode = await this.masterCustomerRepo.getLatestCode();
    let nextNumber = 1;

    if (latestCode && latestCode.startsWith('CUS')) {
      const numericPart = parseInt(latestCode.substring(3), 10);
      if (!isNaN(numericPart)) {
        nextNumber = numericPart + 1;
      }
    }

    const generatedCode = 'CUS' + nextNumber.toString().padStart(10, '0');

    // Add generated code to the body before saving
    body.code = generatedCode;

    const result = await this.masterCustomerRepo.save(body);

    return result;
  }

  async update(body: UpdateMasterCustomerDto, id: number) {
    const resultCheck = await this.masterCustomerRepo.getItemById(id);
    if (!resultCheck) {
      throw new InternalServerErrorException('Data not found');
    }
    Object.assign(resultCheck, body);
    const result = await this.masterCustomerRepo.save(resultCheck);

    return result;
  }

  async delete(id: number) {
    const resultCheck = await this.masterCustomerRepo.getItemById(id);
    if (!resultCheck) {
      throw new InternalServerErrorException('Data not found');
    }

    return await this.masterCustomerRepo.softDelete(id);
  }
}
