import { IsString, IsOptional, IsNumber, IsBoolean, Min, IsEmail } from 'class-validator';

export class CreateEntrenadorDto {
  @IsString()
  nombre: string;

  @IsString()
  telefono: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  especialidad?: string;

  @IsNumber()
  @Min(0)
  tarifa_mensual: number;

  @IsBoolean()
  activo: boolean;
}
