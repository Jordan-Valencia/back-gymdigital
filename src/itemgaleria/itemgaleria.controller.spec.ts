import { Test, TestingModule } from '@nestjs/testing';
import { ItemgaleriaController } from './itemgaleria.controller';
import { ItemgaleriaService } from './itemgaleria.service';

describe('ItemgaleriaController', () => {
  let controller: ItemgaleriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemgaleriaController],
      providers: [ItemgaleriaService],
    }).compile();

    controller = module.get<ItemgaleriaController>(ItemgaleriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
