import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MasterCustomer } from './mas-customer.entity';
import { MasterBranch } from './mas-branch.entity';
import { SaleItem } from './trn-sale-item.entity';
import { MasterUser } from './mas-user.entity';
import { PaymentEnum } from 'src/app/enum/trn-sale.enum';

@Entity({ name: 'trn_sale' })
export class Sale extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  receiptNo: string;

  @Column({ type: 'float', nullable: false })
  amount: number;

  @Column({ type: 'float', nullable: true })
  discount: number;

  @Column({ type: 'float', nullable: true })
  vat: number;

  @Column({ type: 'float', nullable: false })
  totalAmount: number;

  @Column({ type: 'datetime', nullable: false })
  saleDate: Date;

  @Column({ type: 'varchar', length: 100, nullable: false })
  payment: PaymentEnum;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: 'Completed',
  })
  status: string;

  //   ---------------------------------------  //

  @ManyToOne(() => MasterCustomer, (customer) => customer.trn_sale)
  @JoinColumn({ name: 'customer_id' })
  mas_customer: MasterCustomer;

  @ManyToOne(() => MasterBranch, (branch) => branch.trn_sale)
  @JoinColumn({ name: 'branch_id' })
  mas_branch: MasterBranch;

  @OneToMany(() => SaleItem, (saleDetail) => saleDetail.trn_sale)
  trn_sale_item: SaleItem[];

  @ManyToOne(() => MasterUser, (user) => user.trn_sale)
  @JoinColumn({ name: 'createBy' })
  mas_user: MasterUser;
}
