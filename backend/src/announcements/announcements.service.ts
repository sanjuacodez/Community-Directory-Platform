import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from './dto/announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAnnouncementDto) {
    return this.prisma.announcement.create({
      data: {
        communityId: dto.communityId,
        title: dto.title,
        content: dto.content,
        image: dto.image,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : new Date(),
      },
      include: { community: { select: { id: true, name: true } } },
    });
  }

  async findAll(communityId?: string) {
    const where: Record<string, unknown> = {};
    if (communityId) where.communityId = communityId;

    return this.prisma.announcement.findMany({
      where,
      include: { community: { select: { id: true, name: true } } },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
      include: { community: { select: { id: true, name: true } } },
    });
    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }
    return announcement;
  }

  async update(id: string, dto: UpdateAnnouncementDto) {
    await this.findOne(id);
    const data: Record<string, unknown> = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.content !== undefined) data.content = dto.content;
    if (dto.image !== undefined) data.image = dto.image;
    if (dto.publishedAt !== undefined)
      data.publishedAt = new Date(dto.publishedAt);

    return this.prisma.announcement.update({
      where: { id },
      data: data as any,
      include: { community: { select: { id: true, name: true } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.announcement.update({
      where: { id },
      data: { status: 'deleted' },
    });
  }
}
