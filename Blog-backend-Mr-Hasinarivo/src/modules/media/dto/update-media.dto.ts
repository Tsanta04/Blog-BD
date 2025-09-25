import { PartialType } from '@nestjs/swagger';
import { CreateMediaDto } from './create-Media.dto';

export class UpdateMediaDto extends PartialType(CreateMediaDto) {}
