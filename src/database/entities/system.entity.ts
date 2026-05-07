import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'system' })
export class System {
  @PrimaryColumn({ type: 'int', unsigned: true })
  id: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column({ type: 'varchar', length: 100, nullable: false })
  key: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  value: string;
}
