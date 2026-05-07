import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Sale } from './trn-sale.entity';

@Entity({ name: 'mas_customer' })
export class MasterCustomer extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  code: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  firstname: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  surname: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nickname: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone: string;

  // ------------------------------------ //

  @OneToMany(() => Sale, (sale) => sale.mas_customer)
  trn_sale: Sale[];
}
