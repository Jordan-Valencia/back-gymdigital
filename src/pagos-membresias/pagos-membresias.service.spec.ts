import { Test, TestingModule } from '@nestjs/testing';
import { PagosMembresiasService } from './pagos-membresias.service';

describe('PagosMembresiasService', () => {
  let service: PagosMembresiasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PagosMembresiasService],
    }).compile();

    service = module.get<PagosMembresiasService>(PagosMembresiasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
