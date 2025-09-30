import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { TicketFieldValue } from './ticket-field-value.entity';

export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  EMAIL = 'email',
  PHONE = 'phone',
  DATE = 'date',
  DATETIME = 'datetime',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
}

@Entity('category_fields')
export class CategoryField {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  category_id: string;

  @Column({ type: 'varchar' })
  field_name: string;

  @Column({
    type: 'enum',
    enum: FieldType,
  })
  field_type: FieldType;

  @Column({ type: 'boolean', default: false })
  is_required: boolean;

  // Relations
  @ManyToOne(() => Category, (category) => category.fields)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => TicketFieldValue, (value) => value.field)
  ticket_field_values: TicketFieldValue[];
}
