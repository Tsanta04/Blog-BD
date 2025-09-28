import { Controller, Post, Param, UseGuards, Req } from '@nestjs/common';
import { LikeService } from './like-user.service';
import { JwtAuthGuard } from '@/common/guard/jwt.guard';
import { ToggleLikeDto } from './dto/toggle-like-user.dto';

@Controller('api')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  // POST /api/like_user/:id
  @UseGuards(JwtAuthGuard)
  @Post('like_user/:id')
  async toggleLike(@Param() params: ToggleLikeDto, @Req() req) {
    const userId = req.userId; // injecté par le guard
    const toLikeId = params.userId;
    return this.likeService.toggleLike(userId, toLikeId);
  }

  // POST /api/follow/:id
  @UseGuards(JwtAuthGuard)
  @Post('follow/:id')
  async toggleFollow(@Param() params: ToggleLikeDto, @Req() req) {
    const userId = req.userId; // injecté par le guard
    const toFollowId = params.userId;
    return this.likeService.toggleFollow(userId, toFollowId);
  }
}
