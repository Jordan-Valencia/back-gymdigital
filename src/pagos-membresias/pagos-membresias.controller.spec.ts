import { Test, TestingModule } from '@nestjs/testing';
import { PagosMembresiasController } from './pagos-membresias.controller';
import { PagosMembresiasService } from './pagos-membresias.service';

describe('PagosMembresiasController', () => {
  let controller: PagosMembresiasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagosMembresiasController],
      providers: [PagosMembresiasService],
    }).compile();

    controller = module.get<PagosMembresiasController>(PagosMembresiasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
