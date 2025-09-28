import { Controller, Post, Get, Param, Req, UseGuards } from '@nestjs/common';
import { LikeService } from './like-post.service';
import { JwtAuthGuard } from '@/common/guard/jwt.guard';

@Controller('api')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('like_post/:postId')
  toggleLike(@Req() req, @Param('postId') postId: string) {
    const userId = req.userId;
    return this.likeService.toggleLike(userId, postId);
  }

  @Get('liked_post/:postId')
  listUsers(@Param('postId') postId: string) {
    return this.likeService.listUsers(postId);
  }
}
