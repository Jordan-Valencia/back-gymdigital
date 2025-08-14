import { IsString, IsEmail, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nombre: string;

  @IsString()
  telefono: string;

  @IsEmail()
  email: string;

  @IsDateString()
  fecha_nacimiento: string; // Se enviará en formato YYYY-MM-DD y se transforma a Date en el servicio

  @IsBoolean()
  activo: boolean;

  @IsOptional()
  @IsString()
  notas?: string;
}
