import { IsString, IsOptional } from 'class-validator';

export class SearchPostDto {
  @IsString()
  @IsOptional()
  q?: string;
}
