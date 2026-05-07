import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MasterUser } from './mas-user.entity';
import { booleanTransformer } from 'src/helpers/function';
import { Stock } from './trn-stock.entity';
import { Sale } from './trn-sale.entity';

@Entity({ name: 'mas_branch' })
export class MasterBranch extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  taxIdNumber: string;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  qrFileName: string;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  qrFilePath: string;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  qrFileOriginalName: string;

  @Column({ type: 'nvarchar', length: 512, nullable: true })
  qrFileType: string;

  @Column({
    type: 'tinyint',
    nullable: false,
    default: true,
    transformer: booleanTransformer,
  })
  isActive: boolean;

  @OneToMany(() => MasterUser, (user) => user.mas_branch)
  mas_user: MasterUser[];

  @OneToMany(() => Stock, (stock) => stock.mas_branch)
  trn_stock: Stock[];

  @OneToMany(() => Sale, (sale) => sale.mas_branch)
  trn_sale: Sale[];
}
