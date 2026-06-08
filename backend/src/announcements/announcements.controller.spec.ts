import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';

describe('AnnouncementsController', () => {
  let controller: AnnouncementsController;
  let service: { [key: string]: jest.Mock };

  const mockAnnouncement = {
    id: 'ann-1',
    communityId: 'comm-1',
    title: 'Test',
    content: 'Content',
    image: null,
    publishedAt: new Date(),
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    community: { id: 'comm-1', name: 'Test' },
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnnouncementsController],
      providers: [
        { provide: AnnouncementsService, useValue: service },
      ],
    }).compile();

    controller = module.get<AnnouncementsController>(
      AnnouncementsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an announcement', async () => {
      service.create.mockResolvedValue(mockAnnouncement);

      const result = await controller.create({
        communityId: 'comm-1',
        title: 'Test',
        content: 'Content',
      });

      expect(result).toEqual(mockAnnouncement);
      expect(service.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return announcements', async () => {
      service.findAll.mockResolvedValue([mockAnnouncement]);

      const result = await controller.findAll();

      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return an announcement', async () => {
      service.findOne.mockResolvedValue(mockAnnouncement);

      const result = await controller.findOne('ann-1');

      expect(result).toEqual(mockAnnouncement);
    });
  });

  describe('update', () => {
    it('should update an announcement', async () => {
      service.update.mockResolvedValue({
        ...mockAnnouncement,
        title: 'Updated',
      });

      const result = await controller.update('ann-1', { title: 'Updated' });

      expect(result.title).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should delete an announcement', async () => {
      service.remove.mockResolvedValue({
        ...mockAnnouncement,
        status: 'deleted',
      });

      const result = await controller.remove('ann-1');

      expect(result.status).toBe('deleted');
    });
  });
});
