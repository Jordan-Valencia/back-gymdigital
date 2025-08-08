import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class CreateEntrenadorDto {
  @IsString()
  id: string;

  @IsString()
  nombre: string;

  @IsString()
  telefono: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  especialidad?: string;

  @IsNumber()
  tarifa_hora: number;

  @IsDateString()
  fecha_registro: string; 

  @IsBoolean()
  activo: boolean;
}
