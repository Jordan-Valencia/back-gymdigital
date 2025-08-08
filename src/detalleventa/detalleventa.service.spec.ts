import { Test, TestingModule } from '@nestjs/testing';
import { DetalleventaService } from './detalleventa.service';

describe('DetalleventaService', () => {
  let service: DetalleventaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetalleventaService],
    }).compile();

    service = module.get<DetalleventaService>(DetalleventaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
