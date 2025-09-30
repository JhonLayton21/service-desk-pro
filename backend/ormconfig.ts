import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './src/entities/user.entity';
import { Category } from './src/entities/category.entity';
import { CategoryField } from './src/entities/category-field.entity';
import { TicketPriority } from './src/entities/ticket-priority.entity';
import { CategoryPrioritySla } from './src/entities/category-priority-sla.entity';
import { TicketStatus } from './src/entities/ticket-status.entity';
import { Ticket } from './src/entities/ticket.entity';
import { TicketFieldValue } from './src/entities/ticket-field-value.entity';
import { TicketTransition } from './src/entities/ticket-transition.entity';
import { TicketComment } from './src/entities/ticket-comment.entity';
import { SlaAlert } from './src/entities/sla-alert.entity';

ConfigModule.forRoot();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'servicedeskpro',
  entities: [
    User,
    Category,
    CategoryField,
    TicketPriority,
    CategoryPrioritySla,
    TicketStatus,
    Ticket,
    TicketFieldValue,
    TicketTransition,
    TicketComment,
    SlaAlert,
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Always false for migrations
});
