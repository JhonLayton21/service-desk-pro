import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Ticket } from './ticket.entity';
import { TicketTransition } from './ticket-transition.entity';

@Entity('ticket_status')
export class TicketStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'boolean', default: false })
  is_final: boolean;

  // Relations
  @OneToMany(() => Ticket, (ticket) => ticket.status)
  tickets: Ticket[];

  @OneToMany(() => TicketTransition, (transition) => transition.previous_status)
  previous_transitions: TicketTransition[];

  @OneToMany(() => TicketTransition, (transition) => transition.new_status)
  new_transitions: TicketTransition[];
}
