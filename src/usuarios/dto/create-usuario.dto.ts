import { IsString, IsBoolean, IsEmail, IsOptional, IsDateString } from 'class-validator';

export class CreateUsuarioDto {
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
