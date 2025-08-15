import { IsString, IsEmail, IsOptional, IsBoolean } from "class-validator";

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
}
