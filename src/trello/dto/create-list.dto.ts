import { IsString, IsUUID, IsOptional, IsNumber } from 'class-validator';

export class CreateListDto {
  @IsUUID()
  boardId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  position?: number;
}

export class UpdateListDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  position?: number;
}