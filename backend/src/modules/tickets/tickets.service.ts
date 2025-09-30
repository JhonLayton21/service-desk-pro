import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../../entities/ticket.entity';
import { TicketFieldValue } from '../../entities/ticket-field-value.entity';
import { TicketTransition } from '../../entities/ticket-transition.entity';
import { TicketComment } from '../../entities/ticket-comment.entity';
import { SlaAlert } from '../../entities/sla-alert.entity';
import { CreateTicketDto } from '../../dto/create-ticket.dto';
import { UpdateTicketDto } from '../../dto/update-ticket.dto';
import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    @InjectRepository(TicketFieldValue)
    private ticketFieldValuesRepository: Repository<TicketFieldValue>,
    @InjectRepository(TicketTransition)
    private ticketTransitionsRepository: Repository<TicketTransition>,
    @InjectRepository(TicketComment)
    private ticketCommentsRepository: Repository<TicketComment>,
    @InjectRepository(SlaAlert)
    private slaAlertsRepository: Repository<SlaAlert>,
    private usersService: UsersService,
    private categoriesService: CategoriesService,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    // Validate requester exists
    const requester = await this.usersService.findOne(createTicketDto.requester_id);
    
    // Validate category exists and get SLA information
    const category = await this.categoriesService.findOne(createTicketDto.category_id);
    
    // Calculate SLA due dates
    const now = new Date();
    const firstResponseDue = new Date(now.getTime() + (createTicketDto.sla_first_response_hours_snapshot * 60 * 60 * 1000));
    const resolutionDue = new Date(now.getTime() + (createTicketDto.sla_resolution_hours_snapshot * 60 * 60 * 1000));

    const ticket = this.ticketsRepository.create({
      ...createTicketDto,
      sla_first_response_due: firstResponseDue,
      sla_resolution_due: resolutionDue,
    });

    const savedTicket = await this.ticketsRepository.save(ticket);

    // Create initial status transition
    await this.createTransition(savedTicket.id, 0, createTicketDto.status_id, createTicketDto.requester_id);

    return this.findOne(savedTicket.id);
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketsRepository.find({
      relations: [
        'requester',
        'assigned_to',
        'category',
        'status',
        'priority',
        'field_values',
        'transitions',
        'comments',
        'sla_alerts',
      ],
    });
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({
      where: { id },
      relations: [
        'requester',
        'assigned_to',
        'category',
        'status',
        'priority',
        'field_values',
        'transitions',
        'comments',
        'sla_alerts',
      ],
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);
    
    // If status is being updated, create a transition
    if (updateTicketDto.status_id && updateTicketDto.status_id !== ticket.status_id && updateTicketDto.changed_by_id) {
      await this.createTransition(id, ticket.status_id, updateTicketDto.status_id, updateTicketDto.changed_by_id);
    }

    await this.ticketsRepository.update(id, updateTicketDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const ticket = await this.findOne(id);
    await this.ticketsRepository.remove(ticket);
  }

  // Field Values methods
  async addFieldValue(ticketId: string, fieldValueData: any): Promise<TicketFieldValue> {
    const ticket = await this.findOne(ticketId);
    const fieldValue = this.ticketFieldValuesRepository.create({
      ...fieldValueData,
      ticket_id: ticketId,
    });
    const savedFieldValue = await this.ticketFieldValuesRepository.save(fieldValue);
    return Array.isArray(savedFieldValue) ? savedFieldValue[0] : savedFieldValue;
  }

  async updateFieldValue(fieldValueId: string, value: string): Promise<TicketFieldValue> {
    const fieldValue = await this.ticketFieldValuesRepository.findOne({
      where: { id: fieldValueId },
    });
    if (!fieldValue) {
      throw new NotFoundException(`Field value with ID ${fieldValueId} not found`);
    }
    
    fieldValue.value = value;
    return this.ticketFieldValuesRepository.save(fieldValue);
  }

  // Comments methods
  async addComment(ticketId: string, commentData: any): Promise<TicketComment> {
    const ticket = await this.findOne(ticketId);
    const comment = this.ticketCommentsRepository.create({
      ...commentData,
      ticket_id: ticketId,
    });
    const savedComment = await this.ticketCommentsRepository.save(comment);
    return Array.isArray(savedComment) ? savedComment[0] : savedComment;
  }

  async updateComment(commentId: string, comment: string): Promise<TicketComment> {
    const existingComment = await this.ticketCommentsRepository.findOne({
      where: { id: commentId },
    });
    if (!existingComment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }
    
    existingComment.comment = comment;
    return this.ticketCommentsRepository.save(existingComment);
  }

  async removeComment(commentId: string): Promise<void> {
    const comment = await this.ticketCommentsRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }
    await this.ticketCommentsRepository.remove(comment);
  }

  // Transition methods
  async createTransition(ticketId: string, previousStatusId: number, newStatusId: number, changedById: string): Promise<TicketTransition> {
    const transition = this.ticketTransitionsRepository.create({
      ticket_id: ticketId,
      previous_status_id: previousStatusId,
      new_status_id: newStatusId,
      changed_by_id: changedById,
      changed_at: new Date(),
    });
    return this.ticketTransitionsRepository.save(transition);
  }

  // SLA Alert methods
  async createSlaAlert(ticketId: string, alertType: string): Promise<SlaAlert> {
    const alert = this.slaAlertsRepository.create({
      ticket_id: ticketId,
      alert_type: alertType as any,
      triggered_at: new Date(),
    });
    return this.slaAlertsRepository.save(alert);
  }

  async resolveSlaAlert(alertId: string): Promise<SlaAlert> {
    const alert = await this.slaAlertsRepository.findOne({
      where: { id: alertId },
    });
    if (!alert) {
      throw new NotFoundException(`SLA alert with ID ${alertId} not found`);
    }
    
    alert.resolved = true;
    return this.slaAlertsRepository.save(alert);
  }
}
