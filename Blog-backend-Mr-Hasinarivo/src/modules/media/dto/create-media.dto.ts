import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMediaDto {
  @ApiProperty({ description: 'Nom du type de cuisine' })
  @IsNotEmpty()
  name: string;
}
