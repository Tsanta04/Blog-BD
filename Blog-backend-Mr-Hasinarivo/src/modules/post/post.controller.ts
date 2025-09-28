import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '@/common/guard/jwt.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { SearchPostDto } from './dto/search-post.dto';

@Controller('')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // GET /api/posts
  @Get('posts')
  index() {    
    return this.postService.findAll();
  }

  // GET /api/posts/search?q=...
  @Get('posts/search')
  search(@Query() query: SearchPostDto) {    
    return this.postService.search(query.q);
  }

  // GET /api/posts/:userId
  @Get('posts/:userId')
  getByUser(@Param('userId') userId: string) {
    return this.postService.findByUser(userId);
  }

  // GET /api/post/:id
  @Get('post/:id')
  show(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  // POST /api/post
  @UseGuards(JwtAuthGuard)
  @Post('post')
  create(@Req() req, @Body() dto: CreatePostDto) {
    const userId = req.userId; // injecté par JwtAuthGuard
    return this.postService.create({ ...dto, user_id: userId });
  }

  // GET /api/post/stat
  @UseGuards(JwtAuthGuard)
  @Get('post/stat')
  getPostStat(@Req() req) {
    const userId = req.userId;
    return this.postService.getPostStat(userId);
  }
}
