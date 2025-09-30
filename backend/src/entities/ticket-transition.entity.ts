import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';
import { TicketStatus } from './ticket-status.entity';
import { User } from './user.entity';

@Entity('ticket_transitions')
export class TicketTransition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  ticket_id: string;

  @Column({ type: 'int' })
  previous_status_id: number;

  @Column({ type: 'int' })
  new_status_id: number;

  @Column({ type: 'uuid' })
  changed_by_id: string;

  @Column({ type: 'timestamp' })
  changed_at: Date;

  // Relations
  @ManyToOne(() => Ticket, (ticket) => ticket.transitions)
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @ManyToOne(() => TicketStatus, (status) => status.previous_transitions)
  @JoinColumn({ name: 'previous_status_id' })
  previous_status: TicketStatus;

  @ManyToOne(() => TicketStatus, (status) => status.new_transitions)
  @JoinColumn({ name: 'new_status_id' })
  new_status: TicketStatus;

  @ManyToOne(() => User, (user) => user.ticket_transitions)
  @JoinColumn({ name: 'changed_by_id' })
  changed_by: User;
}
