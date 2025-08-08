import { IsString, IsEmail, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  id: string;

  @IsString()
  nombre: string;

  @IsString()
  telefono: string;

  @IsEmail()
  email: string;

  @IsDateString()
  fecha_nacimiento: string;

  @IsBoolean()
  activo: boolean;

  @IsOptional()
  @IsString()
  notas?: string;
}
