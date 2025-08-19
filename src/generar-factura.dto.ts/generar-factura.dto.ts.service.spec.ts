import { Test, TestingModule } from '@nestjs/testing';
import { GenerarFacturaDtoTsService } from './generar-factura.dto.ts.service';

describe('GenerarFacturaDtoTsService', () => {
  let service: GenerarFacturaDtoTsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerarFacturaDtoTsService],
    }).compile();

    service = module.get<GenerarFacturaDtoTsService>(GenerarFacturaDtoTsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
