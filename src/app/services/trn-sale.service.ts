import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { SaleRepo } from '../repositories/trn-sale.repo';
import { SaleItemRepo } from '../repositories/trn-sale-item.repo';
import { SaleScheduleRepo } from '../repositories/trn-sale-schedule.repo';
import {
  CreateSaleDto,
  SearchSaleDto,
  UpdateSaleDto,
} from '../dto/trn-sale.dto';
import { filterFunction } from 'src/helpers/function-filter';
import { Connection } from 'typeorm';
import { CoureseProduct } from 'src/database/entities/courses-product.entity';
import { Stock } from 'src/database/entities/trn-stock.entity';
import { MasterProduct } from 'src/database/entities/mas-product.entity';

@Injectable()
export class SaleService {
  constructor(
    private saleRepo: SaleRepo,
    private saleItemRepo: SaleItemRepo,
    private saleScheduleRepo: SaleScheduleRepo,
    private connection: Connection,
  ) {}

  async search(body: SearchSaleDto) {
    let { conditionValue, relationValue, sortingValue } =
      await filterFunction(body);

    const conditions = [];
    if (body.advanceFilter?.branchId) {
      conditions.push({ mas_branch: { id: body.advanceFilter?.branchId } });
    }
    if (body.advanceFilter?.customerId) {
      conditions.push({ mas_customer: { id: body.advanceFilter?.customerId } });
    }

    if (conditions.length > 0) {
      const additionalCondition = Object.assign({}, ...conditions);
      if (Array.isArray(conditionValue)) {
        if (conditionValue.length === 0) {
          conditionValue = [additionalCondition];
        } else {
          conditionValue = conditionValue.map((cond) => ({
            ...cond,
            ...additionalCondition,
          }));
        }
      } else {
        conditionValue = { ...conditionValue, ...additionalCondition };
      }
    }

    const model = {
      relations: relationValue || [
        'mas_customer',
        'mas_branch',
        'mas_user',
        'trn_sale_item',
      ],
      where: conditionValue,
      order: sortingValue,
      skip: (body.page - 1) * body.limit,
      take: body.limit,
    };

    const [data, count] = await this.saleRepo.findConditionAndCount(model);
    return { data, totalItem: count };
  }

  private async generateReceiptNo(): Promise<string> {
    const repo = await this.saleRepo.repoOriginal();
    const lastSales = await repo.find({
      order: { id: 'DESC' },
      withDeleted: true,
      take: 1,
    });
    const lastSale = lastSales[0];

    let nextNumber = 1;
    if (lastSale && lastSale.receiptNo) {
      const lastNumberStr = lastSale.receiptNo.replace('REP', '');
      const lastNumber = parseInt(lastNumberStr, 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    const nextNumberStr = nextNumber.toString().padStart(10, '0');
    return `REP${nextNumberStr}`;
  }

  async create(body: CreateSaleDto, userId: number) {
    const receiptNo = await this.generateReceiptNo();

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect(); // เชื่อมต่อ DB
    await queryRunner.startTransaction(); // บอก DB ว่า "ตั้งแต่นี้ไปคือการทำ Transaction นะ"

    try {
      // --- 0. START STOCK CHECK AND DEDUCT ---
      const requiredProducts: {
        [productId: number]: { qty: number; name: string };
      } = {};

      if (body.items && body.items.length > 0) {
        for (const item of body.items) {
          if (item.itemType === 'Product' && item.productId) {
            const product = await queryRunner.manager.findOne(MasterProduct, {
              where: { id: item.productId },
            });
            const productName = product
              ? product.name
              : `Product ID ${item.productId}`;

            if (!requiredProducts[item.productId]) {
              requiredProducts[item.productId] = { qty: 0, name: productName };
            }
            requiredProducts[item.productId].qty += item.quantity;
          } else if (item.itemType === 'Course' && item.courseId) {
            const courseProducts = await queryRunner.manager.find(
              CoureseProduct,
              {
                where: { mas_courses: { id: item.courseId } },
                relations: ['mas_product'],
              },
            );

            for (const cp of courseProducts) {
              const productId = cp.mas_product.id;
              const qtyNeeded = item.quantity * cp.quantity;

              if (!requiredProducts[productId]) {
                requiredProducts[productId] = {
                  qty: 0,
                  name: cp.mas_product.name,
                };
              }
              requiredProducts[productId].qty += qtyNeeded;
            }
          }
        }
      }

      const errors = [];
      const stocksToUpdate = [];

      for (const productId of Object.keys(requiredProducts)) {
        const pId = Number(productId);
        const reqQty = requiredProducts[pId].qty;
        const pName = requiredProducts[pId].name;

        const stock = await queryRunner.manager.findOne(Stock, {
          where: {
            mas_product: { id: pId },
            mas_branch: { id: body.branchId },
          },
        });

        const currentQty = stock ? stock.quantity : 0;
        if (currentQty < reqQty) {
          const shortage = reqQty - currentQty;
          errors.push(`สินค้า ${pName} ไม่เพียงพอ (ขาดอีก ${shortage} ชิ้น)`);
        } else {
          stock.quantity -= reqQty;
          stocksToUpdate.push(stock);
        }
      }

      if (errors.length > 0) {
        throw new BadRequestException(errors.join(', '));
      }

      if (stocksToUpdate.length > 0) {
        await queryRunner.manager.save(Stock, stocksToUpdate);
      }
      // --- END STOCK CHECK AND DEDUCT ---

      // 1. Create Sale
      const salePayload = {
        receiptNo: receiptNo,
        amount: body.amount,
        vat: body.vat,
        totalAmount: body.totalAmount,
        discount: body.discount,
        saleDate: body.saleDate,
        payment: body.payment,
        mas_customer: { id: body.customerId },
        mas_branch: { id: body.branchId },
        mas_user: { id: userId },
      };

      const newSale = await queryRunner.manager.save(
        (await this.saleRepo.repoOriginal()).target,
        salePayload,
      );

      // 2. Create Sale Items
      if (body.items && body.items.length > 0) {
        const saleItemsPayload = body.items.map((item) => {
          const payload: any = {
            trn_sale: { id: newSale.id },
            itemType: item.itemType,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          };

          if (item.courseId) {
            payload.mas_courses = { id: item.courseId };
          }
          if (item.productId) {
            payload.mas_product = { id: item.productId };
          }

          return payload;
        });

        const savedItems = await queryRunner.manager.save(
          (await this.saleItemRepo.repoOriginal()).target,
          saleItemsPayload,
        );

        // 3. Create Sale Schedules for Courses
        const schedulesPayload = [];
        savedItems.forEach((savedItem, index) => {
          const originalItem = body.items[index];
          if (originalItem.itemType === 'Course' && originalItem.schedules) {
            originalItem.schedules.forEach((schedule, sIndex) => {
              schedulesPayload.push({
                trn_sale_item: { id: savedItem.id },
                sessionNumber: sIndex + 1,
                scheduleDate: schedule.date,
                scheduleTime: schedule.time,
                status: 'Pending',
                isFree: schedule.isFree || false,
              });
            });
          }
        });

        if (schedulesPayload.length > 0) {
          await queryRunner.manager.save(
            (await this.saleScheduleRepo.repoOriginal()).target,
            schedulesPayload,
          );
        }
      }

      await queryRunner.commitTransaction(); // ถ้าทุกอย่างผ่านฉลุย ไม่มี Error จะมาถึงบรรทัดนี้ -->  ยืนยันการบันทึกข้อมูลทั้งหมดลง DB จริงๆ
      return newSale;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async update(body: UpdateSaleDto, id: number) {
    const resultCheck = await this.saleRepo.getItemById(id);
    if (!resultCheck) {
      throw new InternalServerErrorException('Data not found');
    }

    const newPayload: any = { ...body };
    if (body.customerId) {
      newPayload.mas_customer = { id: body.customerId };
    }

    Object.assign(resultCheck, newPayload);
    return await this.saleRepo.save(resultCheck);
  }

  async delete(id: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sale = await queryRunner.manager.findOne(
        (await this.saleRepo.repoOriginal()).target,
        {
          where: { id },
          relations: [
            'mas_branch',
            'trn_sale_item',
            'trn_sale_item.mas_product',
            'trn_sale_item.mas_courses',
            'trn_sale_item.schedules',
          ],
        },
      );

      if (!sale) {
        throw new InternalServerErrorException('Data not found');
      }

      // --- 1. RESTORE STOCK ---
      const restoreProducts: { [productId: number]: { qty: number } } = {};

      if (sale.trn_sale_item && sale.trn_sale_item.length > 0) {
        for (const item of sale.trn_sale_item) {
          if (item.itemType === 'Product' && item.mas_product) {
            const pId = item.mas_product.id;
            if (!restoreProducts[pId]) restoreProducts[pId] = { qty: 0 };
            restoreProducts[pId].qty += item.quantity;
          } else if (item.itemType === 'Course' && item.mas_courses) {
            const courseProducts = await queryRunner.manager.find(
              CoureseProduct,
              {
                where: { mas_courses: { id: item.mas_courses.id } },
                relations: ['mas_product'],
              },
            );

            for (const cp of courseProducts) {
              const pId = cp.mas_product.id;
              const qtyToRestore = item.quantity * cp.quantity;
              if (!restoreProducts[pId]) restoreProducts[pId] = { qty: 0 };
              restoreProducts[pId].qty += qtyToRestore;
            }
          }
        }
      }

      const stocksToUpdate = [];
      const branchId = sale.mas_branch ? sale.mas_branch.id : null;

      if (branchId) {
        for (const productId of Object.keys(restoreProducts)) {
          const pId = Number(productId);
          const restoreQty = restoreProducts[pId].qty;

          const stock = await queryRunner.manager.findOne(Stock, {
            where: { mas_product: { id: pId }, mas_branch: { id: branchId } },
          });

          if (stock) {
            stock.quantity += restoreQty;
            stocksToUpdate.push(stock);
          } else {
            const newStock = queryRunner.manager.create(Stock, {
              mas_product: { id: pId },
              mas_branch: { id: branchId },
              quantity: restoreQty,
            });
            stocksToUpdate.push(newStock);
          }
        }

        if (stocksToUpdate.length > 0) {
          await queryRunner.manager.save(Stock, stocksToUpdate);
        }
      }

      // --- 2. SOFT DELETE RELATED TABLES ---
      if (sale.trn_sale_item && sale.trn_sale_item.length > 0) {
        for (const item of sale.trn_sale_item) {
          if (item.schedules && item.schedules.length > 0) {
            await queryRunner.manager.softRemove(item.schedules);
          }
        }
        await queryRunner.manager.softRemove(sale.trn_sale_item);
      }

      const deletedSale = await queryRunner.manager.softRemove(sale);

      await queryRunner.commitTransaction();
      return deletedSale;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err.message);
    } finally {
      await queryRunner.release();
    }
  }
}
