import { Test, TestingModule } from '@nestjs/testing';
import { HoratrabajadaService } from './horatrabajada.service';

describe('HoratrabajadaService', () => {
  let service: HoratrabajadaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HoratrabajadaService],
    }).compile();

    service = module.get<HoratrabajadaService>(HoratrabajadaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
