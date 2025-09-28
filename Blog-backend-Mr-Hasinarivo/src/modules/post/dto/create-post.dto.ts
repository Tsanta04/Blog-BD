import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

class MediaTypeDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  type_: string;
}

class MediaDto {
  @IsNotEmpty()
  @IsString()
  path_name: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaTypeDto)
  type_?: MediaTypeDto;

  @IsNotEmpty()
  @IsNumber()
  type_id: number;
}

class TagsDto {
  @IsOptional()
  @IsString()
  tags?: string;

  @IsOptional()
  @IsNumber()
  id?: number;
}

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString() // tu avais mis UUID, mais ton `id` semble être un string Mongo ou UUID custom
  user_id: string;

  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return value;
  })
  medias?: MediaDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagsDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return value;
  })
  tags?: TagsDto[];
}
