import { Test, TestingModule } from '@nestjs/testing';
import { CategoriainventarioController } from './categoriainventario.controller';
import { CategoriainventarioService } from './categoriainventario.service';

describe('CategoriainventarioController', () => {
  let controller: CategoriainventarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriainventarioController],
      providers: [CategoriainventarioService],
    }).compile();

    controller = module.get<CategoriainventarioController>(CategoriainventarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
