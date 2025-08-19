import { Test, TestingModule } from '@nestjs/testing';
import { GenerarFacturaDtoTsController } from './generar-factura.dto.ts.controller';
import { GenerarFacturaDtoTsService } from './generar-factura.dto.ts.service';

describe('GenerarFacturaDtoTsController', () => {
  let controller: GenerarFacturaDtoTsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenerarFacturaDtoTsController],
      providers: [GenerarFacturaDtoTsService],
    }).compile();

    controller = module.get<GenerarFacturaDtoTsController>(GenerarFacturaDtoTsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
