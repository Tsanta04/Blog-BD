import {
  Controller,
  UseGuards,
} from '@nestjs/common';
import { ApiTag } from '@nestjs/swagger';
import { JwtGuard } from '@/common/guard/jwt.guard';
import { RolesGuard } from '@/common/guard/roles.guard';

@UseGuards(JwtGuard, RolesGuard)
@ApiTags('Tag')
@Controller('Tags')
export class TagController {
  constructor() {}

}
