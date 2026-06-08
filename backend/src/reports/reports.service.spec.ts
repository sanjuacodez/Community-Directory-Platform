import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ReportsService', () => {
  let service: ReportsService;
  let prisma: any;

  beforeEach(async () => {
    const memberGroupBy = jest.fn();
    memberGroupBy.mockImplementation((args: any) => {
      if (args.by.includes('bloodGroup')) {
        return Promise.resolve([{ bloodGroup: 'O+', _count: 5 }]);
      }
      return Promise.resolve([{ profession: 'Engineer', _count: 3 }]);
    });

    prisma = {
      member: { count: jest.fn().mockResolvedValue(10), groupBy: memberGroupBy },
      family: { count: jest.fn().mockResolvedValue(3) },
      community: { count: jest.fn().mockResolvedValue(2), findMany: jest.fn().mockResolvedValue([{ id: 'c-1', name: 'Test' }]) },
      announcement: { count: jest.fn().mockResolvedValue(5) },
      event: { count: jest.fn().mockResolvedValue(4) },
      business: { count: jest.fn().mockResolvedValue(7) },
      job: { count: jest.fn().mockResolvedValue(2) },
      obituary: { count: jest.fn().mockResolvedValue(0) },
    };
    service = (await Test.createTestingModule({
      providers: [ReportsService, { provide: PrismaService, useValue: prisma }],
    }).compile()).get<ReportsService>(ReportsService);
  });

  it('should return dashboard stats', async () => {
    const stats = await service.getDashboard();
    expect(stats.members).toBe(10);
    expect(stats.families).toBe(3);
    expect(stats.communities).toBe(2);
    expect(stats.announcements).toBe(5);
    expect(stats.events).toBe(4);
    expect(stats.businesses).toBe(7);
  });

  it('should return blood group stats', async () => {
    const stats = await service.getBloodGroupStats();
    expect(stats).toHaveLength(1);
  });

  it('should return profession stats', async () => {
    const stats = await service.getProfessionStats();
    expect(stats).toHaveLength(1);
  });
});
