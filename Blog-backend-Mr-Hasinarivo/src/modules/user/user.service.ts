import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // Récupérer un utilisateur par son id
  async getOne(userId: string, likerId?: string) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) throw new NotFoundException('User not found');

    const followersCount = user.followers?.length || 0;
    const likesCount = user.likes?.length || 0;
    const isLiked = likerId ? user.likes?.some(id => id.toString() === likerId) : false;
    const isFollowed = likerId ? user.followers?.some(id => id.toString() === likerId) : false;

    // Si tu as une collection Post, récupère les posts ici
    const posts = []; // à remplacer par vrai modèle Post si existant
    const postsCount = posts.length;

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      posts,
      postsCount,
      followersCount,
      isLiked,
      isFollowed,
      likesCount,
    };
  }

  // Rechercher des utilisateurs par query
  async search(query?: string) {
    const regex = new RegExp(query || '', 'i'); // insensible à la casse
    const users = await this.userModel
      .find({ $or: [{ name: regex }, { email: regex }] })
      .sort({ name: 1 })
      .lean();

    return users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
    }));
  }

  // Récupérer tous les utilisateurs
  async getAll() {
    const users = await this.userModel.find().sort({ name: 1 }).lean();
    return users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
    }));
  }
}
