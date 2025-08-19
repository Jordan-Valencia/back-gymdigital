import { IsString, IsUUID, IsOptional, IsNumber } from 'class-validator';

export class CreateCardDto {
  @IsUUID()
  listId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  position?: number;
}

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  position?: number;
}