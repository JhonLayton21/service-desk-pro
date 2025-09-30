import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { TicketPriority } from './ticket-priority.entity';
import { TicketStatus } from './ticket-status.entity';
import { TicketFieldValue } from './ticket-field-value.entity';
import { TicketTransition } from './ticket-transition.entity';
import { TicketComment } from './ticket-comment.entity';
import { SlaAlert } from './sla-alert.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'uuid' })
  requester_id: string;

  @Column({ type: 'uuid' })
  category_id: string;

  @Column({ type: 'int' })
  status_id: number;

  @Column({ type: 'int' })
  priority_id: number;

  @Column({ type: 'uuid', nullable: true })
  assigned_to_id: string;

  // Snapshots for historical data
  @Column({ type: 'varchar' })
  category_name_snapshot: string;

  @Column({ type: 'varchar' })
  priority_name_snapshot: string;

  @Column({ type: 'int' })
  sla_first_response_hours_snapshot: number;

  @Column({ type: 'int' })
  sla_resolution_hours_snapshot: number;

  @Column({ type: 'timestamp', nullable: true })
  sla_first_response_due: Date;

  @Column({ type: 'timestamp', nullable: true })
  sla_resolution_due: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.requested_tickets)
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @ManyToOne(() => User, (user) => user.assigned_tickets)
  @JoinColumn({ name: 'assigned_to_id' })
  assigned_to: User;

  @ManyToOne(() => Category, (category) => category.tickets)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => TicketStatus, (status) => status.tickets)
  @JoinColumn({ name: 'status_id' })
  status: TicketStatus;

  @ManyToOne(() => TicketPriority, (priority) => priority.tickets)
  @JoinColumn({ name: 'priority_id' })
  priority: TicketPriority;

  @OneToMany(() => TicketFieldValue, (value) => value.ticket)
  field_values: TicketFieldValue[];

  @OneToMany(() => TicketTransition, (transition) => transition.ticket)
  transitions: TicketTransition[];

  @OneToMany(() => TicketComment, (comment) => comment.ticket)
  comments: TicketComment[];

  @OneToMany(() => SlaAlert, (alert) => alert.ticket)
  sla_alerts: SlaAlert[];
}
