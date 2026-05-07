import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MasterCourses } from './mas-courses.entity';
import { MasterProduct } from './mas-product.entity';

@Entity({ name: 'courses_product' })
export class CoureseProduct extends BaseEntity {
  @Column({ type: 'decimal', nullable: false })
  quantity: number;

  // ------------------------------------------------------------ //
  @ManyToOne(() => MasterCourses, (courses) => courses.courses_product)
  @JoinColumn({ name: 'course_id' })
  mas_courses: MasterCourses;

  @ManyToOne(() => MasterProduct, (product) => product.courses_product)
  @JoinColumn({ name: 'product_id' })
  mas_product: MasterProduct;
}
