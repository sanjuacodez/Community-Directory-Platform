import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateBusinessDto, UpdateBusinessDto } from './dto/business.dto';

@Injectable()
export class BusinessesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateBusinessDto) {
    return this.prisma.business.create({ data: dto as any, include: { community: { select: { id: true, name: true } } } });
  }
  async findAll(communityId?: string, category?: string) {
    const where: Record<string, unknown> = {};
    if (communityId) where.communityId = communityId;
    if (category) where.category = category;
    return this.prisma.business.findMany({ where, orderBy: { createdAt: 'desc' }, include: { community: { select: { id: true, name: true } } } });
  }
  async findOne(id: string) {
    const b = await this.prisma.business.findUnique({ where: { id }, include: { community: { select: { id: true, name: true } } } });
    if (!b) throw new NotFoundException('Business not found');
    return b;
  }
  async update(id: string, dto: UpdateBusinessDto) {
    await this.findOne(id);
    return this.prisma.business.update({ where: { id }, data: dto as any, include: { community: { select: { id: true, name: true } } } });
  }
  async remove(id: string) { await this.findOne(id); return this.prisma.business.delete({ where: { id } }); }
}
