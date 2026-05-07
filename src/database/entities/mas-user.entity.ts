import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RoleEnum, SexEnum } from 'src/app/enum/mas-user.enum';
import { booleanTransformer } from 'src/helpers/function';
import { MasterBranch } from './mas-branch.entity';
import { Sale } from './trn-sale.entity';

@Entity({ name: 'mas_user' })
export class MasterUser extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  username: string;

  @Column({ type: 'longtext', nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  firstname: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  surname: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  idCardNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nickname: string;

  @Column({ type: 'date', nullable: true })
  birthday: string;

  @Column({
    type: 'tinyint',
    nullable: false,
    default: true,
    transformer: booleanTransformer,
  })
  isActive: boolean;

  @Column({
    type: 'bit',
    nullable: false,
    default: false,
    transformer: booleanTransformer,
  })
  isRefactorPassword: boolean;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    default: RoleEnum.User,
  })
  role: RoleEnum;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sex: SexEnum;

  // --------------------------------------------------------------------------------------------- //

  @ManyToOne(() => MasterBranch, (branch) => branch.mas_user)
  mas_branch: MasterBranch;

  @OneToMany(() => Sale, (sale) => sale.mas_user)
  trn_sale: Sale[];
}
