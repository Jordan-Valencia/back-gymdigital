import { Test, TestingModule } from '@nestjs/testing';
import { HoratrabajadaController } from './horatrabajada.controller';
import { HoratrabajadaService } from './horatrabajada.service';

describe('HoratrabajadaController', () => {
  let controller: HoratrabajadaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HoratrabajadaController],
      providers: [HoratrabajadaService],
    }).compile();

    controller = module.get<HoratrabajadaController>(HoratrabajadaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
