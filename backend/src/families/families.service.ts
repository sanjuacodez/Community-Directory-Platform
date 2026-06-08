import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateFamilyDto, UpdateFamilyDto } from './dto/family.dto';

@Injectable()
export class FamiliesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFamilyDto) {
    return this.prisma.family.create({
      data: {
        communityId: dto.communityId,
        name: dto.name,
        houseName: dto.houseName,
        address: dto.address,
        adminId: dto.adminId,
      },
      include: {
        community: true,
        _count: {
          select: { members: true },
        },
      },
    });
  }

  async findAll(communityId?: string) {
    const where: Record<string, unknown> = {
      status: { not: 'deleted' },
    };
    if (communityId) {
      where.communityId = communityId;
    }

    return this.prisma.family.findMany({
      where,
      include: {
        community: true,
        _count: {
          select: { members: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const family = await this.prisma.family.findUnique({
      where: { id },
      include: {
        community: true,
        members: {
          where: { status: { not: 'deleted' } },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            gender: true,
            email: true,
            phone: true,
          },
        },
        _count: {
          select: { members: true },
        },
      },
    });

    if (!family) {
      throw new NotFoundException('Family not found');
    }

    return family;
  }

  async update(id: string, dto: UpdateFamilyDto) {
    await this.findOne(id);

    return this.prisma.family.update({
      where: { id },
      data: dto as any,
      include: {
        community: true,
        _count: {
          select: { members: true },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.family.update({
      where: { id },
      data: { status: 'deleted' },
    });
  }
}
