import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { booleanTransformer } from 'src/helpers/function';
import { CoureseProduct } from './courses-product.entity';
import { Stock } from './trn-stock.entity';
import { SaleItem } from './trn-sale-item.entity';

@Entity({ name: 'mas_product' })
export class MasterProduct extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  fileName: string;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  filePath: string;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  fileOriginalName: string;

  @Column({ type: 'nvarchar', length: 512, nullable: true })
  fileType: string;

  @Column({
    type: 'tinyint',
    nullable: false,
    default: true,
    transformer: booleanTransformer,
  })
  isActive: boolean;

  // ------------------------------------ //

  @OneToMany(
    () => CoureseProduct,
    (coursesProduct) => coursesProduct.mas_product,
  )
  courses_product: CoureseProduct[];

  @OneToMany(() => Stock, (stock) => stock.mas_product)
  stock: Stock[];

  @OneToMany(() => SaleItem, (saleDetail) => saleDetail.mas_product)
  trn_sale_item: SaleItem[];
}
