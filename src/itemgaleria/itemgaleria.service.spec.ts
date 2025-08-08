import { Test, TestingModule } from '@nestjs/testing';
import { ItemgaleriaService } from './itemgaleria.service';

describe('ItemgaleriaService', () => {
  let service: ItemgaleriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemgaleriaService],
    }).compile();

    service = module.get<ItemgaleriaService>(ItemgaleriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
