import { IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsUUID()
  cardId: string;

  @IsString()
  content: string;
}

export class UpdateCommentDto {
  @IsString()
  content?: string;
}