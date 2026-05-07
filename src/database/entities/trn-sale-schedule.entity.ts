import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SaleItem } from './trn-sale-item.entity';
import { StatusSaleScheduleEnum } from 'src/app/enum/trn-sale-schedule.enum';
import { booleanTransformer } from 'src/helpers/function';

@Entity({ name: 'trn_sale_schedule' })
export class SaleSchedule extends BaseEntity {
  @Column({ type: 'int', nullable: false })
  sessionNumber: number;

  @Column({ type: 'date', nullable: false })
  scheduleDate: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  scheduleTime: string;

  @Column({ type: 'varchar', length: 50, default: 'Pending' })
  status: StatusSaleScheduleEnum;

  @Column({
    type: 'tinyint',
    nullable: false,
    default: false,
    transformer: booleanTransformer,
  })
  isFree: boolean;

  @ManyToOne(() => SaleItem, (saleItem) => saleItem.schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sale_item_id' })
  trn_sale_item: SaleItem;
}
