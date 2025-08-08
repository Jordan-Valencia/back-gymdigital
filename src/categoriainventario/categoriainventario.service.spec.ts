import { Test, TestingModule } from '@nestjs/testing';
import { CategoriainventarioService } from './categoriainventario.service';

describe('CategoriainventarioService', () => {
  let service: CategoriainventarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriainventarioService],
    }).compile();

    service = module.get<CategoriainventarioService>(CategoriainventarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
