import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { User } from '@/modules/user/schemas/user.schema';
import { Comment } from '@/modules/comment/schemas/comment.schema';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  // GET /api/post/stat
  async getPostStat(userId: string) {
    // Similaire à ta requête SQL avec generate_series()
    return await this.postModel.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          num: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
    ]);
  }

  // GET /api/posts
  async findAll(limit = 50) {
    const posts = await this.postModel
      .find()
      .populate('user')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name email' } // populate l'auteur du commentaire
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();

    return this.transformPosts(posts);
  }

  // GET /api/posts/:userId
  async findByUser(userId: string, limit = 50) {
    const posts = await this.postModel
      .find({ user: userId })
      .populate('user')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name email' }
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();

    return this.transformPosts(posts);
  }

  // GET /api/posts/search?q=...
  async search(query: string, limit = 50) {
    if (!query) return this.findAll(limit);

    const posts = await this.postModel
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
        ],
      })
      .populate('user')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name email' }
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();

    return this.transformPosts(posts);
  }

  // GET /api/posts/one/:postId
  async findOne(postId: string) {
    const post = await this.postModel
      .findById(postId)
      .populate('user')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name email' },
        options: { sort: { createdAt: 1 } }, // ASC
      })
      .exec();

    if (!post) throw new NotFoundException('Post not found');

    return this.transformPosts([post])[0]; // transformer pour correspondre au format
  }

  // Méthode utilitaire pour transformer les posts
  private transformPosts(posts: any[]) {
    return posts.map(p => {
      const tags = (p.tags ?? []).map((t, index) => {
        if (!t) return null;
        return {
          id: index,
          tags: t.tag || t.tags || t.name,
        };
      }).filter(Boolean);

      const medias = p.medias?.map(m => ({
        pathName: m.pathName,
        type: m.type?.type || null,
      })) ?? [];

      const comments = p.comments?.map(c => ({
        id: c._id,
        content: c.content,
        user: c.user ? { id: c.user._id, name: c.user.name, email: c.user.email } : null,
        createdAt: c.createdAt,
      })) ?? [];

      const likes = p.likes?.map(u => ({ id: u._id, name: u.name })) ?? [];
      const viewsCount = p.views?.length ?? 0;

      return {
        id: p._id,
        title: p.title,
        content: p.content,
        user_id: p.user?._id,
        user: p.user ? { id: p.user._id, name: p.user.name, email: p.user.email } : null,
        tags,
        medias,
        comments,
        commentsCount: comments.length,
        likes,
        likesCount: likes.length,
        viewsCount,
        createdAt: p.createdAt,
      };
    });
  }

  // POST /api/post
  async create(dto: CreatePostDto) {
    // Vérifier si l'utilisateur existe
    const user = await this.userModel.findById(dto.user_id).exec();
    if (!user) throw new BadRequestException('Invalid user_id');

    // Gestion des medias et tags (JSON string ou tableau)
    let medias = dto.medias;
    let tags = dto.tags;

    if (typeof dto.medias === 'string') {
      try {
        medias = JSON.parse(dto.medias);
      } catch {
        medias = [];
      }
    }

    if (typeof dto.tags === 'string') {
      try {
        tags = JSON.parse(dto.tags);
      } catch {
        tags = [];
      }
    }

    // Transformation des medias en sous-documents Media
    const transformedMedias = (medias ?? []).map((m) => ({
      pathName: m.path_name || m.path_name,
      type: m.type_ ? { type: m.type_.type_ || m.type_.type_ } : { type: m.type_id?.toString() },
    }));

    // Transformation des tags si besoin
    const transformedTags = (tags ?? []).map((t) => (typeof t === 'string' ? t : t.tags));

    // Création du post
    const post = new this.postModel({
      title: dto.title,
      content: dto.content,
      user: dto.user_id,
      tags: transformedTags,
      medias: transformedMedias,
      likes: [],
      views: [],
      comments: [],
      createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(),
      updatedAt: new Date(),
    });

    const result = await post.save();
    console.log(result);    

    return result;
  }

}
