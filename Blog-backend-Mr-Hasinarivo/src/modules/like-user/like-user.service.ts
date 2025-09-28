import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import { Redis } from 'ioredis';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject() private readonly redis: Redis, // Redis injecté
  ) {}

  private async updateRedisLikesCount(userId: string, increment: boolean) {
    if (!this.redis) return null;
    const key = `user:${userId}:likes`;
    if (increment) await this.redis.incr(key);
    else await this.redis.decr(key);
    const newCount = await this.redis.get(key);
    return newCount ? parseInt(newCount) : 0;
  }

  // Toggle like
  async toggleLike(userId: string, toLikeId: string) {
    const user = await this.userModel.findById(userId);
    const toLike = await this.userModel.findById(toLikeId);
    if (!user || !toLike) throw new NotFoundException('User not found');

    const index = user.likes.findIndex(id => id.toString() === toLikeId);
    let message: string;
    if (index === -1) {
      user.likes.push(toLike);
      message = 'liked';
    } else {
      user.likes.splice(index, 1);
      message = 'unliked';
    }

    await user.save();
    const likesCount = await this.updateRedisLikesCount(toLikeId, message === 'liked');
    return { message, likesCount };
  }

  // Toggle follow
  async toggleFollow(userId: string, toFollowId: string) {
    const user = await this.userModel.findById(userId);
    const toFollow = await this.userModel.findById(toFollowId);
    if (!user || !toFollow) throw new NotFoundException('User not found');

    const index = user.following.findIndex(id => id.toString() === toFollowId);
    let message: string;
    if (index === -1) {
      user.following.push(toFollow);
      toFollow.followers.push(user);
      message = 'followed';
    } else {
      user.following.splice(index, 1);
      toFollow.followers = toFollow.followers.filter(id => id.toString() !== userId);
      message = 'unfollowed';
    }

    await user.save();
    await toFollow.save();

    const countKey = `user:${toFollowId}:followers`;
    let followersCount = null;
    if (this.redis) {
      if (message === 'followed') await this.redis.incr(countKey);
      else await this.redis.decr(countKey);
      followersCount = parseInt(await this.redis.get(countKey) || '0');
    }

    return { message, followersCount };
  }
}
