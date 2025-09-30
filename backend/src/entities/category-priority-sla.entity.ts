import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { TicketPriority } from './ticket-priority.entity';

@Entity('category_priority_sla')
export class CategoryPrioritySla {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  category_id: string;

  @Column({ type: 'int' })
  priority_id: number;

  @Column({ type: 'int' })
  sla_first_response_hours: number;

  @Column({ type: 'int' })
  sla_resolution_hours: number;

  // Relations
  @ManyToOne(() => Category, (category) => category.priority_slas)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => TicketPriority, (priority) => priority.category_priority_slas)
  @JoinColumn({ name: 'priority_id' })
  priority: TicketPriority;
}
