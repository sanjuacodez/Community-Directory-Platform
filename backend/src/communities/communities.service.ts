import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateCommunityDto, UpdateCommunityDto } from './dto/community.dto';

@Injectable()
export class CommunitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCommunityDto) {
    const existing = await this.prisma.community.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException('Community with this slug already exists');
    }

    return this.prisma.community.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        logo: dto.logo,
      },
    });
  }

  async findAll() {
    return this.prisma.community.findMany({
      where: { status: { not: 'deleted' } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const community = await this.prisma.community.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            families: true,
            members: true,
          },
        },
      },
    });

    if (!community) {
      throw new NotFoundException('Community not found');
    }

    return community;
  }

  async update(id: string, dto: UpdateCommunityDto) {
    await this.findOne(id);

    if (dto.slug) {
      const existing = await this.prisma.community.findUnique({
        where: { slug: dto.slug },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Community with this slug already exists');
      }
    }

    return this.prisma.community.update({
      where: { id },
      data: dto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.community.update({
      where: { id },
      data: { status: 'deleted' },
    });
  }
}
