import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateJobDto, UpdateJobDto } from './dto/job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateJobDto) { const data: any = { ...dto }; if (dto.expiryDate) data.expiryDate = new Date(dto.expiryDate); return this.prisma.job.create({ data, include: { community: { select: { id: true, name: true } } } }); }
  async findAll(communityId?: string) { const where: Record<string, unknown> = {}; if (communityId) where.communityId = communityId; return this.prisma.job.findMany({ where, orderBy: { createdAt: 'desc' }, include: { community: { select: { id: true, name: true } } } }); }
  async findOne(id: string) { const j = await this.prisma.job.findUnique({ where: { id }, include: { community: { select: { id: true, name: true } } } }); if (!j) throw new NotFoundException('Job not found'); return j; }
  async update(id: string, dto: UpdateJobDto) { await this.findOne(id); const data: any = { ...dto }; if (dto.expiryDate) data.expiryDate = new Date(dto.expiryDate); return this.prisma.job.update({ where: { id }, data, include: { community: { select: { id: true, name: true } } } }); }
  async remove(id: string) { await this.findOne(id); return this.prisma.job.delete({ where: { id } }); }
}
