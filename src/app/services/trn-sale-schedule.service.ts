import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SaleScheduleRepo } from '../repositories/trn-sale-schedule.repo';
import {
  CreateSaleScheduleDto,
  SearchSaleScheduleDto,
  UpdateSaleScheduleDto,
} from '../dto/trn-sale-schedule.dto';
import { filterFunction } from 'src/helpers/function-filter';
import { SaleItemRepo } from '../repositories/trn-sale-item.repo';
import * as dayjs from 'dayjs';

@Injectable()
export class SaleScheduleService {
  constructor(
    private readonly saleScheduleRepo: SaleScheduleRepo,
    private readonly saleItemRepo: SaleItemRepo,
  ) {}

  async search(body: SearchSaleScheduleDto) {
    let { conditionValue, relationValue, sortingValue } =
      await filterFunction(body);

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

    const [data, count] =
      await this.saleScheduleRepo.findConditionAndCount(model);
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

  async getBillDetail(saleItemId: number) {
    const modelSearch: any = {
      where: {
        id: saleItemId,
      },
      relations: {
        schedules: true,
        mas_courses: true,
      },
      order: {
        schedules: {
          scheduleDate: 'ASC',
          scheduleTime: 'ASC',
        },
      },
    };
    const result = await this.saleItemRepo.findCondition(modelSearch);
    if (result.length === 0) {
      throw new InternalServerErrorException('Data not found');
    }
    const tmpItem = result[0];
    const schedules = tmpItem.schedules || [];

    const filterSuccess = schedules.filter((item) => item.status === 'Success');
    const scheduleAll = schedules.length;
    const scheduleSuccess = filterSuccess.length;
    const scheduleRemaining = scheduleAll - scheduleSuccess;

    const now = dayjs();
    const pendingSchedules = schedules.filter(
      (item) => item.status === 'Pending',
    );

    pendingSchedules.sort((a, b) => {
      const dateA = dayjs(`${a.scheduleDate} ${a.scheduleTime}`);
      const dateB = dayjs(`${b.scheduleDate} ${b.scheduleTime}`);
      return dateA.valueOf() - dateB.valueOf();
    });

    let nextSchedule = pendingSchedules.find((item) => {
      const itemDateTime = dayjs(`${item.scheduleDate} ${item.scheduleTime}`);
      return itemDateTime.isAfter(now) || itemDateTime.isSame(now);
    });

    if (!nextSchedule && pendingSchedules.length > 0) {
      nextSchedule = pendingSchedules[0];
    }

    const data = {
      scheduleAll,
      scheduleSuccess,
      scheduleRemaining,
      nextScheduleDate: nextSchedule?.scheduleDate || null,
      nextScheduleTime: nextSchedule?.scheduleTime || null,
      courseName: tmpItem.mas_courses?.name || null,
    };
    return data;
  }
}
