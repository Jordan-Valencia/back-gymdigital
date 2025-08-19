import { IsString, IsEmail, IsOptional, IsBoolean, IsDateString } from "class-validator";

export class CreateUsuarioDto {
  @IsString()
  nombre: string;

  @IsString()
  telefono: string;

  @IsEmail()
  email: string;

  @IsString()
  documento: string; 

  @IsBoolean()
  activo: boolean;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsDateString()
  fecha_nacimiento: string; // Formato ISO 8601 (ej.: "1990-05-25")
}
