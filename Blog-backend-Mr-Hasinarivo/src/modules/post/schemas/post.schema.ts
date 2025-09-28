import { Comment } from "@/modules/comment/schemas/comment.schema";
import { Media, MediaSchema } from "./media.schema";
import { User } from "@/modules/user/schemas/user.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class Post {
  _id: mongoose.Types.ObjectId; // <- ajoute ceci
  createdAt?: Date;
  updatedAt?: Date;
  
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) content: string;

 @Prop({ type: [String], default: [] }) 
  tags: string[];
 @Prop({ type: [MediaSchema], default: [] }) 
  medias: Media[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  likes: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  views: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: Comment[];
}

export const PostSchema = SchemaFactory.createForClass(Post);