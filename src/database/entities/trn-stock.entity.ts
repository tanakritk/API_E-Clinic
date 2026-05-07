import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MasterProduct } from './mas-product.entity';
import { MasterBranch } from './mas-branch.entity';

@Entity({ name: 'trn_stock' })
export class Stock extends BaseEntity {
  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'varchar', length: 10000, nullable: true })
  description: string;

  //   ---------------------------------------  //

  @ManyToOne(() => MasterProduct, (product) => product.stock)
  @JoinColumn({ name: 'product_id' })
  mas_product: MasterProduct;

  @ManyToOne(() => MasterBranch, (branch) => branch.trn_stock)
  @JoinColumn({ name: 'branch_id' })
  mas_branch: MasterBranch;
}
