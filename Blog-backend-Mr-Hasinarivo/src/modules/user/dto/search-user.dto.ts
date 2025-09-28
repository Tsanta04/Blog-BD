import { IsOptional, IsString } from 'class-validator';

export class SearchUserDto {
  @IsOptional()
  @IsString()
  q?: string;
}
