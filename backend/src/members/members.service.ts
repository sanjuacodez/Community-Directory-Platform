import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateMemberDto, UpdateMemberDto } from './dto/member.dto';

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMemberDto) {
    return this.prisma.member.create({
      data: {
        communityId: dto.communityId,
        familyId: dto.familyId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender as any,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        bloodGroup: dto.bloodGroup,
        email: dto.email,
        phone: dto.phone,
        profession: dto.profession,
        organization: dto.organization,
        education: dto.education,
        location: dto.location,
        profileImage: dto.profileImage,
        isDeceased: dto.isDeceased ?? false,
        visibility: (dto.visibility ?? 'community_only') as any,
      },
      include: {
        family: true,
        community: true,
      },
    });
  }

  async findAll(params: {
    communityId?: string;
    familyId?: string;
    search?: string;
    bloodGroup?: string;
    profession?: string;
    location?: string;
  }) {
    const where: Record<string, unknown> = {
      status: { not: 'deleted' },
    };

    if (params.communityId) where.communityId = params.communityId;
    if (params.familyId) where.familyId = params.familyId;
    if (params.bloodGroup) where.bloodGroup = params.bloodGroup;
    if (params.profession) where.profession = params.profession;
    if (params.location) where.location = params.location;

    if (params.search) {
      where.OR = [
        { firstName: { contains: params.search, mode: 'insensitive' } },
        { lastName: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.member.findMany({
      where,
      include: {
        family: { select: { id: true, name: true } },
        community: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const member = await this.prisma.member.findUnique({
      where: { id },
      include: {
        family: true,
        community: true,
        relationshipsAs: {
          include: {
            relatedMember: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
        relatedToAs: {
          include: {
            member: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }

  async update(id: string, dto: UpdateMemberDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};
    if (dto.firstName !== undefined) data.firstName = dto.firstName;
    if (dto.lastName !== undefined) data.lastName = dto.lastName;
    if (dto.gender !== undefined) data.gender = dto.gender;
    if (dto.dateOfBirth !== undefined)
      data.dateOfBirth = new Date(dto.dateOfBirth);
    if (dto.bloodGroup !== undefined) data.bloodGroup = dto.bloodGroup;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.profession !== undefined) data.profession = dto.profession;
    if (dto.organization !== undefined) data.organization = dto.organization;
    if (dto.education !== undefined) data.education = dto.education;
    if (dto.location !== undefined) data.location = dto.location;
    if (dto.profileImage !== undefined) data.profileImage = dto.profileImage;
    if (dto.isDeceased !== undefined) data.isDeceased = dto.isDeceased;
    if (dto.visibility !== undefined) data.visibility = dto.visibility;

    return this.prisma.member.update({
      where: { id },
      data: data as any,
      include: {
        family: true,
        community: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.member.update({
      where: { id },
      data: { status: 'deleted' },
    });
  }
}
