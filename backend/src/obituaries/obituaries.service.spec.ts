import { Test, TestingModule } from '@nestjs/testing';
import { ObituariesService } from './obituaries.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ObituariesService', () => {
  let service: ObituariesService; let prisma: any;
  const mock = { id: 'o-1', communityId: 'c-1', memberId: 'm-1', content: null, dateOfDeath: new Date(), createdAt: new Date(), updatedAt: new Date(), community: { id: 'c-1', name: 'Test' }, member: { id: 'm-1', firstName: 'John', lastName: 'Doe' } };
  beforeEach(async () => { prisma = { obituary: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() } }; service = (await Test.createTestingModule({ providers: [ObituariesService, { provide: PrismaService, useValue: prisma }] }).compile()).get<ObituariesService>(ObituariesService); });
  it('create', async () => { prisma.obituary.create.mockResolvedValue(mock); expect(await service.create({ communityId: 'c-1', memberId: 'm-1', dateOfDeath: '2026-01-01' })).toEqual(mock); });
  it('findAll', async () => { prisma.obituary.findMany.mockResolvedValue([mock]); expect(await service.findAll()).toHaveLength(1); });
  it('findOne', async () => { prisma.obituary.findUnique.mockResolvedValue(mock); expect(await service.findOne('1')).toEqual(mock); });
  it('findOne 404', async () => { prisma.obituary.findUnique.mockResolvedValue(null); await expect(service.findOne('x')).rejects.toThrow(NotFoundException); });
  it('update', async () => { prisma.obituary.findUnique.mockResolvedValue(mock); prisma.obituary.update.mockResolvedValue({ ...mock, content: 'RIP' }); expect((await service.update('1', { content: 'RIP' })).content).toBe('RIP'); });
  it('remove', async () => { prisma.obituary.findUnique.mockResolvedValue(mock); prisma.obituary.delete.mockResolvedValue(mock); expect(await service.remove('1')).toEqual(mock); });
});
