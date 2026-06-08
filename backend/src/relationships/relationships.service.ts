import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateRelationshipDto, UpdateRelationshipDto } from './dto/relationship.dto';

@Injectable()
export class RelationshipsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRelationshipDto) {
    if (dto.memberId === dto.relatedMemberId) {
      throw new BadRequestException('Cannot create a relationship with self');
    }

    const [member, relatedMember] = await Promise.all([
      this.prisma.member.findUnique({ where: { id: dto.memberId } }),
      this.prisma.member.findUnique({ where: { id: dto.relatedMemberId } }),
    ]);

    if (!member) throw new NotFoundException('Member not found');
    if (!relatedMember) throw new NotFoundException('Related member not found');

    if (member.familyId !== relatedMember.familyId) {
      throw new BadRequestException(
        'Members must belong to the same family',
      );
    }

    const existing = await this.prisma.memberRelationship.findFirst({
      where: {
        memberId: dto.memberId,
        relatedMemberId: dto.relatedMemberId,
        relationshipType: dto.relationshipType as any,
      },
    });
    if (existing) {
      throw new ConflictException('This relationship already exists');
    }

    // Validate spouse uniqueness
    if (dto.relationshipType === 'spouse') {
      const existingSpouse = await this.prisma.memberRelationship.findFirst({
        where: {
          memberId: dto.memberId,
          relationshipType: 'spouse',
        },
      });
      if (existingSpouse) {
        throw new BadRequestException('Member already has a spouse');
      }
    }

    // Prevent circular references for parent/child
    if (dto.relationshipType === 'father' || dto.relationshipType === 'mother') {
      const childHasParentRole = await this.prisma.memberRelationship.findFirst({
        where: {
          memberId: dto.relatedMemberId,
          relatedMemberId: dto.memberId,
          relationshipType: { in: ['father', 'mother'] },
        },
      });
      if (childHasParentRole) {
        throw new BadRequestException(
          'Circular reference: related member is already a parent of this member',
        );
      }
    }

    if (dto.relationshipType === 'child') {
      const parentHasChildRole = await this.prisma.memberRelationship.findFirst({
        where: {
          memberId: dto.relatedMemberId,
          relatedMemberId: dto.memberId,
          relationshipType: 'child',
        },
      });
      if (parentHasChildRole) {
        throw new BadRequestException(
          'Circular reference: related member is already a child of this member',
        );
      }
    }

    return this.prisma.memberRelationship.create({
      data: {
        memberId: dto.memberId,
        relatedMemberId: dto.relatedMemberId,
        relationshipType: dto.relationshipType as any,
      },
      include: {
        member: { select: { id: true, firstName: true, lastName: true } },
        relatedMember: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async findByMember(memberId: string) {
    const relationships = await this.prisma.memberRelationship.findMany({
      where: { memberId },
      include: {
        relatedMember: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    return relationships.map((r) => ({
      id: r.id,
      relationshipType: r.relationshipType,
      relatedMember: r.relatedMember,
    }));
  }

  async update(id: string, dto: UpdateRelationshipDto) {
    const rel = await this.prisma.memberRelationship.findUnique({
      where: { id },
    });
    if (!rel) throw new NotFoundException('Relationship not found');

    if (dto.relationshipType === 'spouse' && rel.relationshipType !== 'spouse') {
      const existingSpouse = await this.prisma.memberRelationship.findFirst({
        where: {
          memberId: rel.memberId,
          relationshipType: 'spouse',
          id: { not: id },
        },
      });
      if (existingSpouse) {
        throw new BadRequestException('Member already has a spouse');
      }
    }

    return this.prisma.memberRelationship.update({
      where: { id },
      data: dto as any,
    });
  }

  async remove(id: string) {
    const rel = await this.prisma.memberRelationship.findUnique({
      where: { id },
    });
    if (!rel) throw new NotFoundException('Relationship not found');

    await this.prisma.memberRelationship.delete({ where: { id } });
    return { message: 'Relationship deleted' };
  }
}
