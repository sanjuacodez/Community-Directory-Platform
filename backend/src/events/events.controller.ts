import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('super_admin')
  create(@Body() dto: CreateEventDto) { return this.eventsService.create(dto); }

  @Get()
  findAll(@Query('communityId') communityId?: string) { return this.eventsService.findAll(communityId); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.eventsService.findOne(id); }

  @Patch(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('super_admin')
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) { return this.eventsService.update(id, dto); }

  @Delete(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('super_admin')
  remove(@Param('id') id: string) { return this.eventsService.remove(id); }
}
