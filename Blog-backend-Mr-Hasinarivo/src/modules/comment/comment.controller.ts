import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '@/common/guard/jwt.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('api')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // POST /api/comment
  @UseGuards(JwtAuthGuard)
  @Post('comment')
  create(@Req() req, @Body() dto: CreateCommentDto) {
    const userId = req.userId;
    return this.commentService.create(userId, dto);
  }

  // GET /api/comments/:postId
  @Get('comments/:postId')
  index(@Param('postId') postId: string) {
    return this.commentService.findByPost(postId);
  }

  // PUT /api/comment/:id
  @UseGuards(JwtAuthGuard)
  @Put('comment/:id')
  update(@Req() req, @Param('id') commentId: string, @Body() dto: UpdateCommentDto) {
    const userId = req.userId;
    return this.commentService.update(userId, commentId, dto);
  }

  // DELETE /api/comment/:id
  @UseGuards(JwtAuthGuard)
  @Delete('comment/:id')
  delete(@Req() req, @Param('id') commentId: string) {
    const userId = req.userId;
    return this.commentService.delete(userId, commentId);
  }
}
