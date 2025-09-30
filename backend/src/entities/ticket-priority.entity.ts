import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Ticket } from './ticket.entity';
import { CategoryPrioritySla } from './category-priority-sla.entity';

@Entity('ticket_priorities')
export class TicketPriority {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  sla_first_response_hours: number;

  @Column({ type: 'int' })
  sla_resolution_hours: number;

  // Relations
  @OneToMany(() => Ticket, (ticket) => ticket.priority)
  tickets: Ticket[];

  @OneToMany(() => CategoryPrioritySla, (sla) => sla.priority)
  category_priority_slas: CategoryPrioritySla[];
}
