import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { StockRepo } from '../repositories/trn-stock.repo';
import {
  CreateStockDto,
  SearchStockDto,
  UpdateStockDto,
} from '../dto/trn-stock.dto';
import { filterFunction } from 'src/helpers/function-filter';

@Injectable()
export class StockService {
  constructor(private stockRepo: StockRepo) {}

  async search(body: SearchStockDto) {
    let { conditionValue, relationValue, sortingValue } =
      await filterFunction(body);

    if (body.advanceFilter?.branchId) {
      const dateCondition = {
        mas_branch: { id: body.advanceFilter?.branchId },
      };

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

    const model = {
      relations: relationValue,
      where: conditionValue,
      order: sortingValue,
      skip: (body.page - 1) * body.limit,
      take: body.limit,
    };

    const [data, count] = await this.stockRepo.findConditionAndCount(model);
    return { data, totalItem: count };
  }

  async create(body: CreateStockDto) {
    const newBody = {
      ...body,
      mas_product: { id: body.productId },
      mas_branch: { id: body.branchId },
    };
    return await this.stockRepo.save(newBody);
  }

  async import(body: CreateStockDto) {
    const findProductStock = await this.stockRepo.findCondition({
      where: {
        mas_product: { id: body.productId },
        mas_branch: { id: body.branchId },
      },
    });

    if (findProductStock.length === 0) {
      // create ใหม่
      const modelSave = {
        mas_product: { id: body.productId },
        mas_branch: { id: body.branchId },
        quantity: body.quantity,
        description: body.description,
      };
      return await this.stockRepo.save(modelSave);
    } else {
      // update ของเดิม
      const stockItem = findProductStock[0];
      body.quantity = Number(stockItem.quantity) + body.quantity;
      Object.assign(stockItem, body);
      return await this.stockRepo.save(stockItem);
    }
  }

  async update(body: UpdateStockDto, id: number) {
    const resultCheck = await this.stockRepo.getItemById(id);
    if (!resultCheck) {
      throw new InternalServerErrorException('Data not found');
    }

    const newPayload: any = { ...body };
    if (body.productId) {
      newPayload.mas_product = { id: body.productId };
    }
    if (body.branchId) {
      newPayload.mas_branch = { id: body.branchId };
    }

    Object.assign(resultCheck, newPayload);
    return await this.stockRepo.save(resultCheck);
  }

  async delete(id: number) {
    const resultCheck = await this.stockRepo.getItemById(id);
    if (!resultCheck) {
      throw new InternalServerErrorException('Data not found');
    }
    return await this.stockRepo.softDelete(id);
  }
}
