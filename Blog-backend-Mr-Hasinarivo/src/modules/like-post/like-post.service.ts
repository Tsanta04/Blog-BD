import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '@/modules/post/schemas/post.schema';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}

  async toggleLike(userId: string, postId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const alreadyLiked = post.likes.some((u: any) => u.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((u: any) => u.toString() !== userId);
      await post.save();
      return { message: 'unliked', likesCount: post.likes.length };
    }

    post.likes.push(userId as any);
    await post.save();
    return { message: 'liked', likesCount: post.likes.length };
  }

  async listUsers(postId: string) {
    const post = await this.postModel
      .findById(postId)
      .populate('likes', 'id name email');

    if (!post) throw new NotFoundException('Post not found');
    return post.likes;
  }
}
