import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { booleanTransformer } from 'src/helpers/function';
import { CoureseProduct } from './courses-product.entity';
import { SaleItem } from './trn-sale-item.entity';

@Entity({ name: 'mas_courses' })
export class MasterCourses extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  code: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false })
  numberOfTimes: number;

  @Column({ type: 'decimal', nullable: true })
  commission: number;

  @Column({
    type: 'tinyint',
    nullable: false,
    default: true,
    transformer: booleanTransformer,
  })
  isActive: boolean;

  //   -------------------------------------------- //

  @OneToMany(
    () => CoureseProduct,
    (coursesProduct) => coursesProduct.mas_courses,
  )
  courses_product: CoureseProduct[];

  @OneToMany(() => SaleItem, (saleDetail) => saleDetail.mas_courses)
  trn_sale_item: SaleItem[];
}
