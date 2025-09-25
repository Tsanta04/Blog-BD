import {
  Controller,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JwtGuard } from '@/common/guard/jwt.guard';
import { RolesGuard } from '@/common/guard/roles.guard';

@UseGuards(JwtGuard, RolesGuard)
@ApiTags('Like')
@Controller('Likes')
export class LikeController {
  constructor() {}

}
