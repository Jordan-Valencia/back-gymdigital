import { Test, TestingModule } from '@nestjs/testing';
import { IteminventarioController } from './iteminventario.controller';
import { IteminventarioService } from './iteminventario.service';

describe('IteminventarioController', () => {
  let controller: IteminventarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IteminventarioController],
      providers: [IteminventarioService],
    }).compile();

    controller = module.get<IteminventarioController>(IteminventarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
