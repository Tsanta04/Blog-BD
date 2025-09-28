import { Optional } from '@nestjs/common';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  content: string;

  // Facultatif : si tu veux lier directement à un post
  @IsString()
  @Optional()
  @IsNotEmpty()
  postId: string;
}
