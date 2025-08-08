import { Test, TestingModule } from '@nestjs/testing';
import { IteminventarioService } from './iteminventario.service';

describe('IteminventarioService', () => {
  let service: IteminventarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IteminventarioService],
    }).compile();

    service = module.get<IteminventarioService>(IteminventarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
