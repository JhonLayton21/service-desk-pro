import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { Ticket } from '../../entities/ticket.entity';
import { TicketFieldValue } from '../../entities/ticket-field-value.entity';
import { TicketTransition } from '../../entities/ticket-transition.entity';
import { TicketComment } from '../../entities/ticket-comment.entity';
import { SlaAlert } from '../../entities/sla-alert.entity';
import { UsersModule } from '../users/users.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticket,
      TicketFieldValue,
      TicketTransition,
      TicketComment,
      SlaAlert,
    ]),
    UsersModule,
    CategoriesModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
