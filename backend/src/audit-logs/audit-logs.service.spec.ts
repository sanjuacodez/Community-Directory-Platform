import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogsService } from './audit-logs.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuditLogsService', () => {
  let service: AuditLogsService;
  let prisma: any;
  const mockLog = { id: 'log-1', action: 'create', entityType: 'member', entityId: 'm-1', userId: 'u-1', changes: { name: 'Test' }, createdAt: new Date() };

  beforeEach(async () => {
    prisma = { auditLog: { create: jest.fn(), findMany: jest.fn() } };
    service = (await Test.createTestingModule({ providers: [AuditLogsService, { provide: PrismaService, useValue: prisma }] }).compile()).get<AuditLogsService>(AuditLogsService);
  });

  it('should log an action', async () => {
    prisma.auditLog.create.mockResolvedValue(mockLog);
    const result = await service.log('create', 'member', 'm-1', 'u-1', { name: 'Test' });
    expect(result).toEqual(mockLog);
    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ action: 'create', entityType: 'member' }) }),
    );
  });

  it('should find all logs', async () => {
    prisma.auditLog.findMany.mockResolvedValue([mockLog]);
    expect(await service.findAll({})).toHaveLength(1);
  });

  it('should filter by entityType', async () => {
    prisma.auditLog.findMany.mockResolvedValue([]);
    await service.findAll({ entityType: 'member' });
    expect(prisma.auditLog.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { entityType: 'member' } }));
  });
});
