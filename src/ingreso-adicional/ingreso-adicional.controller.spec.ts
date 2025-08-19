import { Test, TestingModule } from '@nestjs/testing';
import { IngresoAdicionalController } from './ingreso-adicional.controller';
import { IngresoAdicionalService } from './ingreso-adicional.service';

describe('IngresoAdicionalController', () => {
  let controller: IngresoAdicionalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngresoAdicionalController],
      providers: [IngresoAdicionalService],
    }).compile();

    controller = module.get<IngresoAdicionalController>(IngresoAdicionalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
