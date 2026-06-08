import { Test, TestingModule } from '@nestjs/testing';
import { BusinessesService } from './businesses.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('BusinessesService', () => {
  let service: BusinessesService;
  let prisma: any;
  const mock = { id: 'b-1', communityId: 'c-1', ownerMemberId: 'm-1', businessName: 'Shop', category: 'retail', description: null, phone: null, email: null, location: null, createdAt: new Date(), updatedAt: new Date(), community: { id: 'c-1', name: 'Test' } };

  beforeEach(async () => {
    prisma = { business: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() } };
    const m = await Test.createTestingModule({ providers: [BusinessesService, { provide: PrismaService, useValue: prisma }] }).compile();
    service = m.get<BusinessesService>(BusinessesService);
  });

  it('create', async () => { prisma.business.create.mockResolvedValue(mock); expect(await service.create({ communityId: 'c-1', ownerMemberId: 'm-1', businessName: 'S' })).toEqual(mock); });
  it('findAll', async () => { prisma.business.findMany.mockResolvedValue([mock]); expect(await service.findAll()).toHaveLength(1); });
  it('findOne', async () => { prisma.business.findUnique.mockResolvedValue(mock); expect(await service.findOne('1')).toEqual(mock); });
  it('findOne not found', async () => { prisma.business.findUnique.mockResolvedValue(null); await expect(service.findOne('x')).rejects.toThrow(NotFoundException); });
  it('update', async () => { prisma.business.findUnique.mockResolvedValue(mock); prisma.business.update.mockResolvedValue({ ...mock, businessName: 'U' }); const r = await service.update('1', { businessName: 'U' }); expect(r.businessName).toBe('U'); });
  it('remove', async () => { prisma.business.findUnique.mockResolvedValue(mock); prisma.business.delete.mockResolvedValue(mock); expect(await service.remove('1')).toEqual(mock); });
});
