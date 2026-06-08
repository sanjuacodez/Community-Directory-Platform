import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('JobsService', () => {
  let service: JobsService; let prisma: any;
  const mock = { id: 'j-1', communityId: 'c-1', title: 'Dev', company: null, location: null, description: null, contactInformation: null, expiryDate: null, createdAt: new Date(), updatedAt: new Date(), community: { id: 'c-1', name: 'Test' } };
  beforeEach(async () => { prisma = { job: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() } }; service = (await Test.createTestingModule({ providers: [JobsService, { provide: PrismaService, useValue: prisma }] }).compile()).get<JobsService>(JobsService); });
  it('create', async () => { prisma.job.create.mockResolvedValue(mock); expect(await service.create({ communityId: 'c-1', title: 'Dev' })).toEqual(mock); });
  it('findAll', async () => { prisma.job.findMany.mockResolvedValue([mock]); expect(await service.findAll()).toHaveLength(1); });
  it('findOne', async () => { prisma.job.findUnique.mockResolvedValue(mock); expect(await service.findOne('1')).toEqual(mock); });
  it('findOne 404', async () => { prisma.job.findUnique.mockResolvedValue(null); await expect(service.findOne('x')).rejects.toThrow(NotFoundException); });
  it('update', async () => { prisma.job.findUnique.mockResolvedValue(mock); prisma.job.update.mockResolvedValue({ ...mock, title: 'U' }); expect((await service.update('1', { title: 'U' })).title).toBe('U'); });
  it('remove', async () => { prisma.job.findUnique.mockResolvedValue(mock); prisma.job.delete.mockResolvedValue(mock); expect(await service.remove('1')).toEqual(mock); });
});
