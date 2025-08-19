// create-board.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  title: string; // Debe llamarse igual que el modelo Prisma

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
