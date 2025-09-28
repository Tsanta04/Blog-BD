import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Post } from '@/modules/post/schemas/post.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}

  async create(userId: string, dto: CreateCommentDto) {
    const post = await this.postModel.findById(dto.postId);
    if (!post) throw new NotFoundException('Post not found');

    const comment = new this.commentModel({
      content: dto.content,
      user: userId,
      post: dto.postId,
    });
    await comment.save();
    return { message: 'Comment added', id: comment._id };
  }

  async findByPost(postId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    return this.commentModel
      .find({ post: postId })
      .populate('user', 'name email')
      .sort({ createdAt: 1 });
  }

  async update(userId: string, commentId: string, dto: UpdateCommentDto) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.user.toString() !== userId) {
      throw new ForbiddenException('Forbidden');
    }

    comment.content = dto.content;
    await comment.save();
    return { message: 'Comment updated' };
  }

  async delete(userId: string, commentId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.user.toString() !== userId) {
      throw new ForbiddenException('Forbidden');
    }

    await comment.deleteOne();
    return { message: 'Comment deleted' };
  }
}
