import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  // Facultatif : si tu veux lier directement à un post
  @IsString()
  @IsNotEmpty()
  postId: string;
}
