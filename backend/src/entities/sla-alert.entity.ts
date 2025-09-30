import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';

export enum AlertType {
  FIRST_RESPONSE_OVERDUE = 'first_response_overdue',
  RESOLUTION_OVERDUE = 'resolution_overdue',
  FIRST_RESPONSE_WARNING = 'first_response_warning',
  RESOLUTION_WARNING = 'resolution_warning',
}

@Entity('sla_alerts')
export class SlaAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  ticket_id: string;

  @Column({
    type: 'enum',
    enum: AlertType,
  })
  alert_type: AlertType;

  @Column({ type: 'timestamp' })
  triggered_at: Date;

  @Column({ type: 'boolean', default: false })
  resolved: boolean;

  // Relations
  @ManyToOne(() => Ticket, (ticket) => ticket.sla_alerts)
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;
}
