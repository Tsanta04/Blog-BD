import { Controller, Post, Body, Get, Req, UseGuards, Put, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '@/common/guard/jwt.guard';

@ApiTags('Auth')
@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('moi')
  async me(@Req() req: any) {
    return this.authService.me(req.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  async logout(@Req() req: any) {
    return this.authService.logout(req.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('update_user/:id')
  async updateUser(@Param('id') id: string, @Body() body: any) {
    return this.authService.updateUser(id, body);
  }
}
