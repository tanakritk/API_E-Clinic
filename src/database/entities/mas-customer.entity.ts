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

  @Column({ type: 'date', nullable: true })
  birthday: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone2: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  idCardNumber: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lineId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  facebook: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  source: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  note: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  tag: string;

  // ------------------------------------ //

  @OneToMany(() => Sale, (sale) => sale.mas_customer)
  trn_sale: Sale[];
}
