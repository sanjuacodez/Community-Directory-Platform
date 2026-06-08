import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateEventDto, UpdateEventDto } from './dto/event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEventDto) {
    return this.prisma.event.create({
      data: { ...dto, eventDate: new Date(dto.eventDate), image: dto.image },
      include: { community: { select: { id: true, name: true } } },
    });
  }

  async findAll(communityId?: string) {
    const where: Record<string, unknown> = {};
    if (communityId) where.communityId = communityId;
    return this.prisma.event.findMany({
      where, orderBy: { eventDate: 'asc' },
      include: { community: { select: { id: true, name: true } } },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id }, include: { community: { select: { id: true, name: true } } },
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: string, dto: UpdateEventDto) {
    await this.findOne(id);
    const data: Record<string, unknown> = { ...dto };
    if (dto.eventDate) data.eventDate = new Date(dto.eventDate);
    return this.prisma.event.update({ where: { id }, data: data as any, include: { community: { select: { id: true, name: true } } } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.event.delete({ where: { id } });
  }
}
