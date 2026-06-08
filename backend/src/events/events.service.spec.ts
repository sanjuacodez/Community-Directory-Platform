import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('EventsService', () => {
  let service: EventsService;
  let prisma: any;

  const mockEvent = { id: 'ev-1', communityId: 'c-1', title: 'Test', description: 'Desc', eventDate: new Date(), location: 'Hall', image: null, createdAt: new Date(), updatedAt: new Date(), community: { id: 'c-1', name: 'Test' } };

  beforeEach(async () => {
    prisma = { event: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() } };
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get<EventsService>(EventsService);
  });

  it('should create an event', async () => {
    prisma.event.create.mockResolvedValue(mockEvent);
    const r = await service.create({ communityId: 'c-1', title: 'Test', eventDate: '2026-06-01T00:00:00Z' });
    expect(r).toEqual(mockEvent);
  });

  it('should find all events', async () => {
    prisma.event.findMany.mockResolvedValue([mockEvent]);
    expect(await service.findAll()).toHaveLength(1);
  });

  it('should find one event', async () => {
    prisma.event.findUnique.mockResolvedValue(mockEvent);
    expect(await service.findOne('ev-1')).toEqual(mockEvent);
  });

  it('should throw on findOne not found', async () => {
    prisma.event.findUnique.mockResolvedValue(null);
    await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
  });

  it('should update an event', async () => {
    prisma.event.findUnique.mockResolvedValue(mockEvent);
    prisma.event.update.mockResolvedValue({ ...mockEvent, title: 'Updated' });
    const r = await service.update('ev-1', { title: 'Updated' });
    expect(r.title).toBe('Updated');
  });

  it('should delete an event', async () => {
    prisma.event.findUnique.mockResolvedValue(mockEvent);
    prisma.event.delete.mockResolvedValue(mockEvent);
    expect(await service.remove('ev-1')).toEqual(mockEvent);
  });
});
