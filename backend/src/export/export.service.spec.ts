import { Test, TestingModule } from '@nestjs/testing';
import { ExportService } from './export.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ExportService', () => {
  let service: ExportService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      member: { findMany: jest.fn().mockResolvedValue([{ firstName: 'John', lastName: 'Doe', gender: 'male', dateOfBirth: null, bloodGroup: 'O+', email: 'j@test.com', phone: null, profession: 'Dev', organization: null, education: null, location: null, family: { name: 'Fam' }, community: { name: 'Comm' } }]), create: jest.fn() },
      family: { findMany: jest.fn().mockResolvedValue([{ name: 'Fam', houseName: null, address: null, community: { name: 'Comm' }, _count: { members: 2 } }]) },
    };
    service = (await Test.createTestingModule({ providers: [ExportService, { provide: PrismaService, useValue: prisma }] }).compile()).get<ExportService>(ExportService);
  });

  it('should export members CSV', async () => {
    const csv = await service.exportMembersCSV();
    expect(csv).toContain('First Name');
    expect(csv).toContain('John');
    expect(csv).toContain('O+');
  });

  it('should export families CSV', async () => {
    const csv = await service.exportFamiliesCSV();
    expect(csv).toContain('Name');
    expect(csv).toContain('Fam');
  });

  it('should import members', async () => {
    prisma.member.create.mockResolvedValue({ id: 'new-1' });
    const result = await service.importMembers([{ firstName: 'New', lastName: 'User', gender: 'male' }], 'c-1', 'f-1');
    expect(result.imported).toBe(1);
    expect(result.errors).toHaveLength(0);
  });
});
