// src/like/dto/toggle-like.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class ToggleLikeDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
