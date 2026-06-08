import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

describe('EventsController', () => {
  let controller: EventsController;
  let service: any;
  const mock = { id: 'e-1', title: 'Test', description: 'D', eventDate: new Date(), location: 'L', image: null, createdAt: new Date(), updatedAt: new Date(), community: { id: 'c-1', name: 'C' } };

  beforeEach(async () => {
    service = { create: jest.fn(), findAll: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController], providers: [{ provide: EventsService, useValue: service }],
    }).compile();
    controller = module.get<EventsController>(EventsController);
  });

  it('create', async () => { service.create.mockResolvedValue(mock); expect(await controller.create({ communityId: 'c-1', title: 'T', eventDate: '2026-06-01T00:00:00Z' })).toEqual(mock); });
  it('findAll', async () => { service.findAll.mockResolvedValue([mock]); expect(await controller.findAll()).toHaveLength(1); });
  it('findOne', async () => { service.findOne.mockResolvedValue(mock); expect(await controller.findOne('1')).toEqual(mock); });
  it('update', async () => { service.update.mockResolvedValue({ ...mock, title: 'U' }); expect((await controller.update('1', { title: 'U' })).title).toBe('U'); });
  it('remove', async () => { service.remove.mockResolvedValue(mock); expect(await controller.remove('1')).toEqual(mock); });
});
