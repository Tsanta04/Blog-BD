import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFollowDto {
  @ApiProperty({ description: 'Nom du type de cuisine' })
  @IsNotEmpty()
  name: string;
}
