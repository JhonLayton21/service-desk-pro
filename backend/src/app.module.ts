import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { Category } from './entities/category.entity';
import { CategoryField } from './entities/category-field.entity';
import { TicketPriority } from './entities/ticket-priority.entity';
import { CategoryPrioritySla } from './entities/category-priority-sla.entity';
import { TicketStatus } from './entities/ticket-status.entity';
import { Ticket } from './entities/ticket.entity';
import { TicketFieldValue } from './entities/ticket-field-value.entity';
import { TicketTransition } from './entities/ticket-transition.entity';
import { TicketComment } from './entities/ticket-comment.entity';
import { SlaAlert } from './entities/sla-alert.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
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
      synchronize: process.env.NODE_ENV === 'development', // Only for development
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
