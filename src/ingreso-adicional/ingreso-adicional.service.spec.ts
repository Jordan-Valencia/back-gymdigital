import { Test, TestingModule } from '@nestjs/testing';
import { IngresoAdicionalService } from './ingreso-adicional.service';

describe('IngresoAdicionalService', () => {
  let service: IngresoAdicionalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngresoAdicionalService],
    }).compile();

    service = module.get<IngresoAdicionalService>(IngresoAdicionalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
