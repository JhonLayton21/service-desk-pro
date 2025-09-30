import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { Ticket } from './ticket.entity';
import { TicketTransition } from './ticket-transition.entity';
import { TicketComment } from './ticket-comment.entity';

export enum UserRole {
  REQUESTER = 'requester',
  AGENT = 'agent',
  MANAGER = 'manager',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password_hash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.REQUESTER,
  })
  role: UserRole;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => Category, (category) => category.created_by)
  categories: Category[];

  @OneToMany(() => Ticket, (ticket) => ticket.requester)
  requested_tickets: Ticket[];

  @OneToMany(() => Ticket, (ticket) => ticket.assigned_to)
  assigned_tickets: Ticket[];

  @OneToMany(() => TicketTransition, (transition) => transition.changed_by)
  ticket_transitions: TicketTransition[];

  @OneToMany(() => TicketComment, (comment) => comment.author)
  ticket_comments: TicketComment[];
}
