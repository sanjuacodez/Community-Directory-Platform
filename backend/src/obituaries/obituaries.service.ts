import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateObituaryDto, UpdateObituaryDto } from './dto/obituary.dto';

@Injectable()
export class ObituariesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateObituaryDto) { return this.prisma.obituary.create({ data: { ...dto, dateOfDeath: new Date(dto.dateOfDeath) }, include: { community: { select: { id: true, name: true } }, member: { select: { id: true, firstName: true, lastName: true } } } }); }
  async findAll(communityId?: string) { const where: Record<string, unknown> = {}; if (communityId) where.communityId = communityId; return this.prisma.obituary.findMany({ where, orderBy: { dateOfDeath: 'desc' }, include: { community: { select: { id: true, name: true } }, member: { select: { id: true, firstName: true, lastName: true } } } }); }
  async findOne(id: string) { const o = await this.prisma.obituary.findUnique({ where: { id }, include: { community: { select: { id: true, name: true } }, member: { select: { id: true, firstName: true, lastName: true } } } }); if (!o) throw new NotFoundException('Obituary not found'); return o; }
  async update(id: string, dto: UpdateObituaryDto) { await this.findOne(id); const data: any = { ...dto }; if (dto.dateOfDeath) data.dateOfDeath = new Date(dto.dateOfDeath); return this.prisma.obituary.update({ where: { id }, data, include: { community: { select: { id: true, name: true } }, member: { select: { id: true, firstName: true, lastName: true } } } }); }
  async remove(id: string) { await this.findOne(id); return this.prisma.obituary.delete({ where: { id } }); }
}
