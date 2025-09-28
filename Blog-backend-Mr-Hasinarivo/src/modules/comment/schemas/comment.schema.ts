import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Post } from "@/modules/post/schemas/post.schema";
import { User } from "@/modules/user/schemas/user.schema";

@Schema({ timestamps: true })
export class Comment {
  _id: mongoose.Types.ObjectId; // <- ajoute ceci
  createdAt?: Date;
  updatedAt?: Date;
    
  @Prop({ required: true })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
  post: Post;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
