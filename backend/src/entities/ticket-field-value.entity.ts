import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';
import { CategoryField } from './category-field.entity';

@Entity('ticket_field_values')
export class TicketFieldValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  ticket_id: string;

  @Column({ type: 'uuid' })
  field_id: string;

  @Column({ type: 'text', nullable: true })
  value: string;

  // Relations
  @ManyToOne(() => Ticket, (ticket) => ticket.field_values)
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @ManyToOne(() => CategoryField, (field) => field.ticket_field_values)
  @JoinColumn({ name: 'field_id' })
  field: CategoryField;
}
