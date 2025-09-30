import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { CategoryField } from './category-field.entity';
import { CategoryPrioritySla } from './category-priority-sla.entity';
import { Ticket } from './ticket.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid' })
  created_by_id: string;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.categories)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @OneToMany(() => CategoryField, (field) => field.category)
  fields: CategoryField[];

  @OneToMany(() => CategoryPrioritySla, (sla) => sla.category)
  priority_slas: CategoryPrioritySla[];

  @OneToMany(() => Ticket, (ticket) => ticket.category)
  tickets: Ticket[];
}
