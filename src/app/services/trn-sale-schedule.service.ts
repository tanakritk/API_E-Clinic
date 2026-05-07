import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SaleScheduleRepo } from '../repositories/trn-sale-schedule.repo';
import { CreateSaleScheduleDto, SearchSaleScheduleDto, UpdateSaleScheduleDto } from '../dto/trn-sale-schedule.dto';
import { filterFunction } from 'src/helpers/function-filter';

@Injectable()
export class SaleScheduleService {
  constructor(private readonly saleScheduleRepo: SaleScheduleRepo) {}

  async search(body: SearchSaleScheduleDto) {
    let { conditionValue, relationValue, sortingValue } = await filterFunction(body);

    if (body.advanceFilter?.saleItemId) {
      const saleItemCondition = {
        trn_sale_item: { id: body.advanceFilter.saleItemId },
      };

      if (Array.isArray(conditionValue)) {
        if (conditionValue.length === 0) {
          conditionValue = [saleItemCondition];
        } else {
          conditionValue = conditionValue.map((cond) => ({
            ...cond,
            ...saleItemCondition,
          }));
        }
      } else {
        conditionValue = { ...conditionValue, ...saleItemCondition };
      }
    }

    const model = {
      relations: relationValue,
      where: conditionValue,
      order: sortingValue,
      skip: (body.page - 1) * body.limit,
      take: body.limit,
    };

    const [data, count] = await this.saleScheduleRepo.findConditionAndCount(model);
    return { data, totalItem: count };
  }

  async create(body: CreateSaleScheduleDto) {
    const newBody = {
      ...body,
      trn_sale_item: { id: body.saleItemId },
    };
    return await this.saleScheduleRepo.save(newBody);
  }

  async update(body: UpdateSaleScheduleDto, id: number) {
    const resultCheck = await this.saleScheduleRepo.getItemById(id);
    if (!resultCheck) {
      throw new InternalServerErrorException('Data not found');
    }

    const newPayload: any = { ...body };
    if (body.saleItemId) {
      newPayload.trn_sale_item = { id: body.saleItemId };
    }

    Object.assign(resultCheck, newPayload);
    return await this.saleScheduleRepo.save(resultCheck);
  }

  async delete(id: number) {
    const resultCheck = await this.saleScheduleRepo.getItemById(id);
    if (!resultCheck) {
      throw new InternalServerErrorException('Data not found');
    }
    return await this.saleScheduleRepo.softDelete(id);
  }
}
