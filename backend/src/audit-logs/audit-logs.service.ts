import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async log(action: string, entityType: string, entityId: string, userId: string, changes?: Record<string, unknown>) {
    return this.prisma.auditLog.create({
      data: { action, entityType, entityId, userId, changes: changes as any },
    });
  }

  async findAll(query: { entityType?: string; entityId?: string; userId?: string; limit?: number }) {
    const where: Record<string, unknown> = {};
    if (query.entityType) where.entityType = query.entityType;
    if (query.entityId) where.entityId = query.entityId;
    if (query.userId) where.userId = query.userId;

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: query.limit ?? 100,
    });
  }
}
