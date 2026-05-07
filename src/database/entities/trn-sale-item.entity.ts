import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Sale } from './trn-sale.entity';
import { MasterCourses } from './mas-courses.entity';
import { MasterProduct } from './mas-product.entity';
import { ItemTypeEnum } from 'src/app/enum/trn-sale-item.enum';
import { SaleSchedule } from './trn-sale-schedule.entity';

@Entity({ name: 'trn_sale_item' })
export class SaleItem extends BaseEntity {
  @Column({ type: 'varchar', length: 50, nullable: false })
  itemType: ItemTypeEnum;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'decimal', nullable: false })
  unitPrice: number;

  @Column({ type: 'decimal', nullable: false })
  totalPrice: number;

  //   ---------------------------------------  //

  @ManyToOne(() => Sale, (sale) => sale.trn_sale_item)
  @JoinColumn({ name: 'sale_id' })
  trn_sale: Sale;

  @ManyToOne(() => MasterCourses, (course) => course.trn_sale_item, {
    nullable: true,
  })
  @JoinColumn({ name: 'course_id' })
  mas_courses: MasterCourses;

  @ManyToOne(() => MasterProduct, (product) => product.trn_sale_item, {
    nullable: true,
  })
  @JoinColumn({ name: 'product_id' })
  mas_product: MasterProduct;

  @OneToMany(() => SaleSchedule, (schedule) => schedule.trn_sale_item, {
    cascade: true,
  })
  schedules: SaleSchedule[];
}
