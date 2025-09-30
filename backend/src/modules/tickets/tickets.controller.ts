import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from '../../dto/create-ticket.dto';
import { UpdateTicketDto } from '../../dto/update-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }

  // Field Values endpoints
  @Post(':id/field-values')
  @HttpCode(HttpStatus.CREATED)
  addFieldValue(@Param('id') id: string, @Body() fieldValueData: any) {
    return this.ticketsService.addFieldValue(id, fieldValueData);
  }

  @Patch('field-values/:fieldValueId')
  updateFieldValue(@Param('fieldValueId') fieldValueId: string, @Body() body: { value: string }) {
    return this.ticketsService.updateFieldValue(fieldValueId, body.value);
  }

  // Comments endpoints
  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  addComment(@Param('id') id: string, @Body() commentData: any) {
    return this.ticketsService.addComment(id, commentData);
  }

  @Patch('comments/:commentId')
  updateComment(@Param('commentId') commentId: string, @Body() body: { comment: string }) {
    return this.ticketsService.updateComment(commentId, body.comment);
  }

  @Delete('comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeComment(@Param('commentId') commentId: string) {
    return this.ticketsService.removeComment(commentId);
  }

  // SLA Alerts endpoints
  @Post(':id/sla-alerts')
  @HttpCode(HttpStatus.CREATED)
  createSlaAlert(@Param('id') id: string, @Body() body: { alert_type: string }) {
    return this.ticketsService.createSlaAlert(id, body.alert_type);
  }

  @Patch('sla-alerts/:alertId/resolve')
  resolveSlaAlert(@Param('alertId') alertId: string) {
    return this.ticketsService.resolveSlaAlert(alertId);
  }
}
