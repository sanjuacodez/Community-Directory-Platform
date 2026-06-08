import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementsService } from './announcements.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('AnnouncementsService', () => {
  let service: AnnouncementsService;
  let prisma: {
    announcement: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };

  const mockAnnouncement = {
    id: 'ann-1',
    communityId: 'comm-1',
    title: 'Test Announcement',
    content: 'Test content',
    image: null,
    publishedAt: new Date(),
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    community: { id: 'comm-1', name: 'Test Community' },
  };

  beforeEach(async () => {
    prisma = {
      announcement: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnnouncementsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AnnouncementsService>(AnnouncementsService);
  });

  describe('create', () => {
    it('should create an announcement', async () => {
      prisma.announcement.create.mockResolvedValue(mockAnnouncement);

      const result = await service.create({
        communityId: 'comm-1',
        title: 'Test Announcement',
        content: 'Test content',
      });

      expect(result).toEqual(mockAnnouncement);
      expect(prisma.announcement.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all announcements', async () => {
      prisma.announcement.findMany.mockResolvedValue([mockAnnouncement]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(prisma.announcement.findMany).toHaveBeenCalled();
    });

    it('should filter by communityId', async () => {
      prisma.announcement.findMany.mockResolvedValue([]);

      await service.findAll('comm-1');

      expect(prisma.announcement.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { communityId: 'comm-1' } }),
      );
    });
  });

  describe('findOne', () => {
    it('should return an announcement by id', async () => {
      prisma.announcement.findUnique.mockResolvedValue(mockAnnouncement);

      const result = await service.findOne('ann-1');

      expect(result).toEqual(mockAnnouncement);
    });

    it('should throw NotFoundException if not found', async () => {
      prisma.announcement.findUnique.mockResolvedValue(null);

      await expect(service.findOne('not-found')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an announcement', async () => {
      prisma.announcement.findUnique.mockResolvedValue(mockAnnouncement);
      prisma.announcement.update.mockResolvedValue({
        ...mockAnnouncement,
        title: 'Updated',
      });

      const result = await service.update('ann-1', { title: 'Updated' });

      expect(result.title).toBe('Updated');
    });

    it('should throw NotFoundException if not found', async () => {
      prisma.announcement.findUnique.mockResolvedValue(null);

      await expect(
        service.update('not-found', { title: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete an announcement', async () => {
      prisma.announcement.findUnique.mockResolvedValue(mockAnnouncement);
      prisma.announcement.update.mockResolvedValue({
        ...mockAnnouncement,
        status: 'deleted',
      });

      const result = await service.remove('ann-1');

      expect(result.status).toBe('deleted');
    });
  });
});
