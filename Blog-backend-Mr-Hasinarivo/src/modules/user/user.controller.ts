import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guard/jwt.guard';
import { UserService } from './user.service';
import { SearchUserDto } from './dto/search-user.dto';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET /api/user/:id
  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async getOne(@Param('id') userId: string, @Req() req) {
    const likerId = req.userId; // injecté par le guard
    return this.userService.getOne(userId, likerId);
  }

  // GET /api/users/search?q=...
  @UseGuards(JwtAuthGuard)
  @Get('users/search')
  async search(@Query() query: SearchUserDto) {
    // query.q est validé automatiquement par le DTO
    return this.userService.search(query.q || '');
  }

  // GET /api/users
  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getAll() {
    return this.userService.getAll();
  }
}
